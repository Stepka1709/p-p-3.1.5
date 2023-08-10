package ru.kata.spring.boot_security.demo.services;

import org.springframework.security.core.userdetails.UserDetailsService;
import ru.kata.spring.boot_security.demo.models.Role;
import ru.kata.spring.boot_security.demo.models.User;

import java.util.List;
import java.util.Set;

public interface UserService extends UserDetailsService {
    User findByUsername(String username);
    void addUser(User user);
    User getUser(int id);
    void deleteUser(int id);
    void editUser(User user);
    List<User> getUsersList();
    List<Role> getRolesList();
    void addRoles(Set<Role> roles);
}
