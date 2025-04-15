package com.example.emr.dao;

import com.example.emr.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository  // Marks this class as a DAO component for Spring’s component scanning.
public class UserDao {

    @Autowired
    private JdbcTemplate jdbcTemplate;  // Spring will automatically inject JdbcTemplate based on your DataSource configuration.

    /**
     * Finds a user matching the provided username and password.
     * Returns a User object if found; otherwise, returns null.
     */
    public User findByUsernameAndPassword(String username, String password) {
        String sql = "SELECT * FROM users WHERE username = ? AND password = ?";
        List<User> users = jdbcTemplate.query(
                sql,
                new Object[]{username, password},
                (rs, rowNum) -> {
                    User user = new User();
                    user.setUserId(rs.getInt("user_id"));
                    user.setUsername(rs.getString("username"));
                    user.setPassword(rs.getString("password"));
                    return user;
                }
        );
        // If the list is empty, return null; otherwise, return the first (and only) user.
        return users.isEmpty() ? null : users.get(0);
    }
}