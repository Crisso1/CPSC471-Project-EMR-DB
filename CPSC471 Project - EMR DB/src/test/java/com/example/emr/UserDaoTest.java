package com.example.emr;

import com.example.emr.dao.UserDao;
import com.example.emr.model.User;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.jdbc.Sql;
import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
public class UserDaoTest {

    @Autowired
    private UserDao userDao;

    @Test
    void testFindByUsernameAndPassword_UserExists() {
        User user = userDao.findByUsernameAndPassword("cristian", "edta46");
        assertNotNull(user, "User should be found for valid credentials.");
        assertEquals("cristian", user.getUsername());
    }

    @Test
    void testFindByUsernameAndPassword_UserExists1() {
        User user = userDao.findByUsernameAndPassword("colby", "password");
        assertNotNull(user, "User should be found for valid credentials.");
        assertEquals("colby", user.getUsername());
    }

    @Test
    void testFindByUsernameAndPassword_UserDoesNotExist() {
        User user = userDao.findByUsernameAndPassword("nonexistent", "nopassword");
        assertNull(user, "User should not be found for invalid credentials.");
    }
}