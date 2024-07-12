package com.example.todoApp.config.security;

import com.example.todoApp.model.UserModel;
import com.example.todoApp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.factory.PasswordEncoderFactories;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {
    @Autowired
    UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        try{
            UserModel user = userRepository.findByUsername(username);


            // 認可があればここで設定できる
            // org.springframework.security.core.userdetails.Userにして返却する
            // パスワードエンコーダを利用してパスワードはエンコードをかける
//            return new User(user.getUserId(), PasswordEncoderFactories.createDelegatingPasswordEncoder().encode(user.getPassword()), new ArrayList<>());
            return new UserWithId(user.getUsername(), user.getPassword(), new ArrayList<>(), user.getUserId());
        }catch (Exception e) {
            throw new UsernameNotFoundException("ユーザーが見つかりません");
        }
    }
}
