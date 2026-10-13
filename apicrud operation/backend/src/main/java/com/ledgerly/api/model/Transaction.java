package com.ledgerly.api.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "transactions", indexes = @Index(name = "idx_transaction_user_date", columnList = "user_id, transaction_date"))
public class Transaction {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @ManyToOne(fetch = FetchType.LAZY, optional = false) @JoinColumn(name = "user_id", nullable = false) private AppUser user;
    @Column(nullable = false, length = 100) private String title;
    @Column(nullable = false, length = 40) private String category;
    @Column(name = "transaction_date", nullable = false) private LocalDate date;
    @Column(nullable = false, precision = 14, scale = 2) private BigDecimal amount;
    @Column(nullable = false, length = 10) private String type;
    @Column(length = 250) private String notes;
    protected Transaction() {}
    public Transaction(AppUser user, String title, String category, LocalDate date, BigDecimal amount, String type, String notes) { this.user=user; update(title,category,date,amount,type,notes); }
    public void update(String title, String category, LocalDate date, BigDecimal amount, String type, String notes) { this.title=title; this.category=category; this.date=date; this.amount=amount; this.type=type; this.notes=notes; }
    public Long getId(){return id;} public AppUser getUser(){return user;} public String getTitle(){return title;} public String getCategory(){return category;} public LocalDate getDate(){return date;} public BigDecimal getAmount(){return amount;} public String getType(){return type;} public String getNotes(){return notes;}
}
