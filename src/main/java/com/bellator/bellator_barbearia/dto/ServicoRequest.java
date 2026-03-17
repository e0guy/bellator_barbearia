package com.bellator.bellator_barbearia.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ServicoRequest {
    @NotBlank
    public String nome;

    @NotNull @Min(0)
    public Double preco;

    @NotNull @Min(5)
    public Integer duracaoMinutos;
}
