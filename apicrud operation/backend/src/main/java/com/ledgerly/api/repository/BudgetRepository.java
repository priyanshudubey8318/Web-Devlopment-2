package com.ledgerly.api.repository;
import com.ledgerly.api.model.Budget;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
public interface BudgetRepository extends JpaRepository<Budget,Long> { List<Budget> findAllByUserIdOrderByCategoryAsc(Long userId); Optional<Budget> findByUserIdAndCategory(Long userId,String category); }
