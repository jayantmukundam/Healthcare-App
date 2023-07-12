package com.example.had.security.controller;
import com.example.had.security.model.AuthRequest;
import com.example.had.security.service.OtpService;
import com.example.had.security.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping(value = "api/client/auth/")
@CrossOrigin(origins = "*")
public class OtpWithJwtController {
    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private JwtUtil jwtTokenUtil;
    @Autowired
    UserDetailsService userDetailsService;

    @Autowired
    private OtpService otpService;



//    @RequestMapping({ "hello" })
//    public String firstPage() {
//        return "Hello World";
//    }

    @RequestMapping(value = "requestOtp/{phoneNo}",method = RequestMethod.GET)
    public Map<String,Object> getOtp(@PathVariable String phoneNo){
        Map<String,Object> returnMap=new HashMap<>();
        try{
            //generate OTP
            String otp = otpService.generateOtp(phoneNo);
//            String otp = "123456";
            returnMap.put("otp", otp);
            returnMap.put("status","success");
            returnMap.put("message","Otp sent successfully");
        }catch (Exception e){
            returnMap.put("status","failed");
            returnMap.put("message",e.getMessage());
        }

        return returnMap;
    }

    @RequestMapping(value = "verifyOtp",method = RequestMethod.POST)
    public Map<String,Object> verifyOtp(@RequestBody AuthRequest authenticationRequest){
//        System.out.println(role);
        Map<String,Object> returnMap=new HashMap<>();
        try{
            //verify otp
//            System.out.println(authenticationRequest.getPhoneNo());
//            System.out.println(otpService.getCacheOtp(authenticationRequest.getPhoneNo()));
//            System.out.println(authenticationRequest.getOtp());
            if(authenticationRequest.getOtp().equals(otpService.getCacheOtp(authenticationRequest.getPhoneNo()))){
//                System.out.println("here");
                String jwtToken = createAuthenticationToken(authenticationRequest);
                returnMap.put("status","success");
                returnMap.put("message","Otp verified successfully");
                returnMap.put("jwt",jwtToken);
                System.out.println(jwtToken);
                otpService.clearOtp(authenticationRequest.getPhoneNo());
            }else{
                returnMap.put("status","success");
                returnMap.put("message","Otp is either expired or incorrect");
            }

        } catch (Exception e){
            returnMap.put("status","failed");
            returnMap.put("message",e.getMessage());
        }

        return returnMap;
    }

    //create auth token
    public String createAuthenticationToken(AuthRequest authenticationRequest) throws Exception {
        try {
//            System.out.println(authenticationRequest.getPhoneNo());
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(authenticationRequest.getPhoneNo(), "")
            );
//                        System.out.println("here");

        }
        catch (BadCredentialsException e) {
            throw new Exception("Incorrect username or password", e);
        }
        UserDetails userDetails = null;
        userDetails = userDetailsService.loadUserByUsername(authenticationRequest.getPhoneNo());



        return jwtTokenUtil.generateToken(userDetails);
    }
}
