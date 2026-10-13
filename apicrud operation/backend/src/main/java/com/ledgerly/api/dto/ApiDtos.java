package com.ledgerly.api.dto;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDate;

public final class ApiDtos {
    private ApiDtos() {}
    public record RegisterRequest(@NotBlank @Size(max=80) String name, @NotBlank @Email @Size(max=190) String email, @NotBlank @Size(min=8,max=100) String password) {}
    public record LoginRequest(@NotBlank @Email String email, @NotBlank String password) {}
    public record UserResponse(Long id, String name, String email) {}
    public record TransactionRequest(@NotBlank @Size(max=100) String title, @NotBlank @Size(max=40) String category, @NotNull LocalDate date, @NotNull @DecimalMin("0.01") @Digits(integer=12,fraction=2) BigDecimal amount, @Pattern(regexp="income|expense") String type, @Size(max=250) String notes) {}
    public record TransactionResponse(Long id, String title, String category, LocalDate date, BigDecimal amount, String type, String notes) {}
    public record BudgetRequest(@NotBlank @Size(max=40) String category, @NotNull @DecimalMin("0.01") @Digits(integer=12,fraction=2) BigDecimal monthlyLimit) {}
    public record BudgetResponse(Long id, String category, BigDecimal monthlyLimit) {}
    public record ErrorResponse(String message) {}
}
