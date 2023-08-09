package ru.kata.spring.boot_security.demo.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import ru.kata.spring.boot_security.demo.models.User;
import ru.kata.spring.boot_security.demo.service.UserService;

@Controller
@RequestMapping("admin")
public class AdminController {

    private final UserService userService;

    public AdminController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public String usersPage(Model model) {
        model.addAttribute("users", userService.getUsersList());
        return "admin";
    }

    @GetMapping("/edit/{id}")
    public String editUserPage(Model model, @PathVariable("id") int id) {
        model.addAttribute("user", userService.getUser(id));
        model.addAttribute("roles", userService.getRolesList());
        return "edit";
    }

    @PatchMapping("/edit/{id}")
    public String editUser(@ModelAttribute("user") User user) {
        userService.editUser(user);
        return "redirect:/admin";
    }

    @GetMapping("/add")
    public String addUserPage(Model model, @ModelAttribute("user") User user) {
        model.addAttribute("roles", userService.getRolesList());
        return "add";
    }

    @PostMapping("/add")
    public String addUser(@ModelAttribute("user") User user) {
        userService.addUser(user);
        return "redirect:/admin";
    }

    @DeleteMapping("/delete/{id}")
    public String deleteUser(@PathVariable("id") int id) {
        userService.deleteUser(id);
        return "redirect:/admin";
    }
}
