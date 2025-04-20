package com.example.emr.controller;

import com.example.emr.dao.UserDao;
import com.example.emr.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:63343")
@RestController             // Indicates that this class is a REST controller
@RequestMapping("/api/users") // Base path for endpoints in this controller
public class UserController {

    @Autowired
    private UserDao userDao;

    /**
     * Endpoint for user login.
     * Expects parameters 'username' and 'password' in the request.
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User loginUser) {
        User user = userDao.findByUsernameAndPassword(loginUser.getUsername(), loginUser.getPassword());
        if (user != null) {
            // Return the user object on successful authentication
            // simulates authentication
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Login successful");
            response.put("token", "fake-jwt-token");
            return ResponseEntity.ok(response);
        } else {
            // Return HTTP 401 if credentials are invalid
            return ResponseEntity.status(401).body("Invalid credentials");
        }
    }
}