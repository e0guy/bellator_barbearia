package com.bellator.bellator_barbearia.config;

import com.bellator.bellator_barbearia.model.Usuarios;
import com.bellator.bellator_barbearia.repository.UsuarioRepository;
import com.bellator.bellator_barbearia.role.Role;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements CommandLineRunner {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        System.out.println("Iniciando DataSeeder...");
        var jose = usuarioRepository.findByEmail("jose@bellator.com");
        if (jose.isEmpty()) {
            System.out.println("Nenhum usuario jose@bellator.com encontrado. Criando conta de Administrador...");
            Usuarios admin = new Usuarios();
            admin.setNome("Administrador do Sistema");
            admin.setEmail("jose@bellator.com");
            admin.setSenhaHash(passwordEncoder.encode("segura6022"));
            admin.setTelefone("81988998115");
            admin.setRole(Role.ADMIN);
            usuarioRepository.save(admin);
            System.out.println("Usuario ADMIN criado com sucesso: jose@bellator.com | Senha: segura6022");
        } else {
            System.out.println("Usuario jose@bellator.com ja existente na base.");
        }
    }
}
