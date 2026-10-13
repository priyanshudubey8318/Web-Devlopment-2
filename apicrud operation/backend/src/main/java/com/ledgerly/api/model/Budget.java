package com.ledgerly.api.model;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name="budgets", uniqueConstraints=@UniqueConstraint(name="uk_budget_user_category", columnNames={"user_id","category"}))
public class Budget {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    @ManyToOne(fetch=FetchType.LAZY, optional=false) @JoinColumn(name="user_id", nullable=false) private AppUser user;
    @Column(nullable=false,length=40) private String category;
    @Column(nullable=false,precision=14,scale=2) private BigDecimal monthlyLimit;
    protected Budget() {}
    public Budget(AppUser user,String category,BigDecimal monthlyLimit){this.user=user;this.category=category;this.monthlyLimit=monthlyLimit;}
    public void setMonthlyLimit(BigDecimal value){this.monthlyLimit=value;}
    public Long getId(){return id;} public AppUser getUser(){return user;} public String getCategory(){return category;} public BigDecimal getMonthlyLimit(){return monthlyLimit;}
}
