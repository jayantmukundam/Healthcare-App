package com.example.had.security.util;


import com.example.had.entities.Actors;
import com.example.had.repositories.ActorsRepo;
import com.example.had.security.model.UserInfo;
import com.example.had.security.service.UserDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

@Component
public class JwtRequestFilter extends OncePerRequestFilter {

    @Autowired
    private UserDetailsService userDetailsService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private ActorsRepo actorsRepo;

//    public String tokenRole;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {

        final String authorizationHeader = request.getHeader("Authorization");

        String username = null;
        String jwt = null;
//        Actors actor = new Actors();

        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
//            this.tokenRole = authorizationHeader.substring(7, 12);
            jwt = authorizationHeader.substring(7);
            username = jwtUtil.extractUsername(jwt);
//            actor = actorsRepo.findActorsByPhoneNo(username);
            System.out.println("username " + username);
//            if(this.tokenRole.equals("Super")) this.tokenRole = "supervisor";
//            else if(this.tokenRole.equals("Field")) this.tokenRole = "fieldworker";
//            else if(this.tokenRole.equals("Doctr")) this.tokenRole = "doctor";
//            else if(this.tokenRole.equals("Admin")) this.tokenRole = "admin";
        }

        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = this.userDetailsService.loadUserByUsername(username);
            UserInfo userInfo = new UserInfo(username, actorsRepo.findActorsByPhoneNo(username).getRole());
            System.out.println(userInfo);

            if (jwtUtil.validateToken(jwt, userDetails)) {

                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        userDetails, null, userInfo.getAuthorities());
                System.out.println(authToken);
                authToken
                        .setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }
        chain.doFilter(request, response);
    }

}
