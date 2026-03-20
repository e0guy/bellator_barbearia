package com.bellator.bellator_barbearia.controller;

import com.bellator.bellator_barbearia.model.Usuarios;
import com.bellator.bellator_barbearia.service.UsuarioService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/usuarios")
public class UsuarioController {

    private final UsuarioService service;

    public UsuarioController(UsuarioService service) {
        this.service = service;
    }

    @GetMapping("/barbeiros")
    public List<Usuarios> listarBarbeiros() {
        return service.listarBarbeiros();
    }
}