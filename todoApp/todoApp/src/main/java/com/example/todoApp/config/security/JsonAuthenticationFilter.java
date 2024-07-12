package com.example.todoApp.config.security;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.example.todoApp.controller.user.request.UserRequest;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.json.JSONObject;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;

import javax.servlet.ServletInputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.ArrayList;


public class JsonAuthenticationFilter extends UsernamePasswordAuthenticationFilter {
    private AuthenticationManager authenticationManager;

    public JsonAuthenticationFilter(AuthenticationManager authenticationManager){



        // AuthenticationManagerの設定
        this.authenticationManager = authenticationManager;

        // ログインパスを設定
        setRequiresAuthenticationRequestMatcher(new AntPathRequestMatcher("/api/login","POST"));
        // ログイン用パラメータの設定
        setUsernameParameter("username");
        setPasswordParameter("password");

        this.setAuthenticationSuccessHandler((req,res,ex) -> {

            UserWithId userWithId = (UserWithId) ex.getPrincipal();
            int userId = userWithId.getUserId(); // ユーザーIDを取得するメソッドの例
            String username = userWithId.getUsername(); // ユーザーネームを取得するメソッドの例
//            String hogrhorgr = ex.getName();

            String token = JWT.create()
                    .withIssuer("localhost") //発行者
                    .withClaim("username", ex.getName()) //keyに対してvalueの設定。汎用的な様々な値を保持できる
                    .sign(Algorithm.HMAC256("secret")); // 利用アルゴリズムを指定してJWTを新規作成
            res.addHeader("X-AUTH-TOKEN", token); // jwtはX-AUTH-TOKENにセットする

            JSONObject responseJson = new JSONObject();
            responseJson.put("userId", userId);
            responseJson.put("username", username);

            res.setStatus(HttpServletResponse.SC_OK);
            res.setContentType("application/json");
            res.getWriter().write(responseJson.toString());
        });

        // ログイン失敗時
        this.setAuthenticationFailureHandler((req,res,ex) -> {
            res.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        });
    }

    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response) throws AuthenticationException {
        try {
            ServletInputStream stream = request.getInputStream();
            // リクエストのjsonの値をUserFormにマッピングします。
            UserRequest userRequest = new ObjectMapper().readValue(request.getInputStream(), UserRequest.class);
            // これでデフォルトのProviderを利用しつつ、ユーザーレコードの取得に関してはUserDetailsServiceの実装クラスのloadUserByUsernameを利用する
//            return this.authenticationManager.authenticate(
//                    new UsernamePasswordAuthenticationToken(form.getUserId(), form.getPassword(), new ArrayList<>())
            return this.authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(userRequest.getUsername(), userRequest.getPassword(), new ArrayList<>())

            );
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
}
