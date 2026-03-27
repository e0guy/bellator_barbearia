package com.bellator.bellator_barbearia.controller;

import com.bellator.bellator_barbearia.dto.RelatorioResponse;
import com.bellator.bellator_barbearia.model.Agendamentos;
import com.bellator.bellator_barbearia.role.StatusAgendamento;
import com.bellator.bellator_barbearia.service.AgendamentoService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import com.bellator.bellator_barbearia.service.UsuarioService;
import com.bellator.bellator_barbearia.model.Usuarios;
import com.bellator.bellator_barbearia.role.Role;
import com.bellator.bellator_barbearia.auth.AuthRegisterRequest;
import com.bellator.bellator_barbearia.auth.AuthService;

@RestController
@RequestMapping("/admin")
public class AdminController {

    private final AgendamentoService agendamentoService;
    private final UsuarioService usuarioService;
    private final AuthService authService;

    public AdminController(AgendamentoService agendamentoService, UsuarioService usuarioService, AuthService authService) {
        this.agendamentoService = agendamentoService;
        this.usuarioService = usuarioService;
        this.authService = authService;
    }

    @GetMapping("/agendamentos")
    @PreAuthorize("hasRole('ADMIN')")
    public List<Agendamentos> listarTodos() {
        return agendamentoService.listarTodos();
    }

    @GetMapping("/relatorio")
    @PreAuthorize("hasRole('ADMIN')")
    public RelatorioResponse relatorio() {
        List<Agendamentos> all = agendamentoService.listarTodos();
        long total = all.size();
        long concluidos = all.stream().filter(a -> a.getStatus() == StatusAgendamento.CONCLUIDO).count();
        double faturamento = all.stream()
                .filter(a -> a.getStatus() == StatusAgendamento.CONCLUIDO)
                .mapToDouble(a -> a.getServicos().getPreco() == null ? 0.0 : a.getServicos().getPreco())
                .sum();
        return new RelatorioResponse(total, concluidos, faturamento);
    }

    @PatchMapping("/usuarios/{id}/role")
    @PreAuthorize("hasRole('ADMIN')")
    public Usuarios promoverUsuario(@PathVariable Long id, @RequestParam Role role) {
        return usuarioService.alterarRoleUsuario(id, role);
    }

    @PostMapping("/barbeiros")
    @PreAuthorize("hasRole('ADMIN')")
    public Usuarios cadastrarBarbeiro(@RequestBody AuthRegisterRequest req) {
        return authService.cadastrarBarbeiroDireto(req);
    }
}
