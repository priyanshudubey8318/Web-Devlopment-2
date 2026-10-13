package com.ledgerly.api.controller;

import com.ledgerly.api.dto.ApiDtos.*;
import com.ledgerly.api.model.AppUser;
import com.ledgerly.api.model.Transaction;
import com.ledgerly.api.repository.TransactionRepository;
import com.ledgerly.api.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;

@RestController @RequestMapping("/api/transactions")
public class TransactionController {
    private final TransactionRepository transactions; private final UserRepository users;
    public TransactionController(TransactionRepository transactions,UserRepository users){this.transactions=transactions;this.users=users;}
    @GetMapping public List<TransactionResponse> list(Authentication auth){AppUser u=current(auth);return transactions.findAllByUserIdOrderByDateDescIdDesc(u.getId()).stream().map(TransactionController::response).toList();}
    @PostMapping @ResponseStatus(HttpStatus.CREATED) public TransactionResponse create(@Valid @RequestBody TransactionRequest r,Authentication auth){return response(transactions.save(new Transaction(current(auth),r.title().trim(),r.category().trim(),r.date(),r.amount(),r.type(),clean(r.notes()))));}
    @PutMapping("/{id}") @Transactional public TransactionResponse update(@PathVariable Long id,@Valid @RequestBody TransactionRequest r,Authentication auth){Transaction t=owned(id,auth);t.update(r.title().trim(),r.category().trim(),r.date(),r.amount(),r.type(),clean(r.notes()));return response(t);}
    @DeleteMapping("/{id}") @ResponseStatus(HttpStatus.NO_CONTENT) public void delete(@PathVariable Long id,Authentication auth){transactions.delete(owned(id,auth));}
    private Transaction owned(Long id,Authentication auth){return transactions.findByIdAndUserId(id,current(auth).getId()).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,"Transaction not found."));}
    private AppUser current(Authentication auth){return users.findByEmailIgnoreCase(auth.getName()).orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED,"Please sign in."));}
    private static String clean(String s){return s==null?null:s.trim();}
    private static TransactionResponse response(Transaction t){return new TransactionResponse(t.getId(),t.getTitle(),t.getCategory(),t.getDate(),t.getAmount(),t.getType(),t.getNotes());}
}
