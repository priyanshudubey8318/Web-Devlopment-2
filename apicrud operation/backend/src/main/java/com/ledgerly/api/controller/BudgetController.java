package com.ledgerly.api.controller;

import com.ledgerly.api.dto.ApiDtos.*;
import com.ledgerly.api.model.AppUser;
import com.ledgerly.api.model.Budget;
import com.ledgerly.api.repository.BudgetRepository;
import com.ledgerly.api.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;

@RestController @RequestMapping("/api/budgets")
public class BudgetController {
    private final BudgetRepository budgets; private final UserRepository users;
    public BudgetController(BudgetRepository budgets,UserRepository users){this.budgets=budgets;this.users=users;}
    @GetMapping public List<BudgetResponse> list(Authentication auth){return budgets.findAllByUserIdOrderByCategoryAsc(current(auth).getId()).stream().map(BudgetController::response).toList();}
    @PutMapping @Transactional public BudgetResponse upsert(@Valid @RequestBody BudgetRequest r,Authentication auth){AppUser u=current(auth);Budget b=budgets.findByUserIdAndCategory(u.getId(),r.category().trim()).orElseGet(() -> new Budget(u,r.category().trim(),r.monthlyLimit()));b.setMonthlyLimit(r.monthlyLimit());return response(budgets.save(b));}
    @DeleteMapping("/{category}") @ResponseStatus(HttpStatus.NO_CONTENT) public void delete(@PathVariable String category,Authentication auth){budgets.findByUserIdAndCategory(current(auth).getId(),category).ifPresent(budgets::delete);}
    private AppUser current(Authentication auth){return users.findByEmailIgnoreCase(auth.getName()).orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED,"Please sign in."));}
    private static BudgetResponse response(Budget b){return new BudgetResponse(b.getId(),b.getCategory(),b.getMonthlyLimit());}
}
