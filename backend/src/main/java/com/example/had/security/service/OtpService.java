package com.example.had.security.service;
import com.google.common.cache.CacheBuilder;
import com.google.common.cache.CacheLoader;
import com.google.common.cache.LoadingCache;
import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import org.springframework.stereotype.Service;

import java.text.DecimalFormat;
import java.util.Random;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.TimeUnit;

@Service
public class OtpService {
    private static final  Integer EXPIRE_MIN = 20;
    private LoadingCache<String,String> otpCache;
//    @Autowired

    public OtpService() {
        otpCache = CacheBuilder.newBuilder()
                .expireAfterWrite(EXPIRE_MIN, TimeUnit.MINUTES)
                .build(new CacheLoader<>() {
                    @Override
                    public String load(String s) {
                        return "";
                    }
                });
    }

    public String generateOtp(String phoneNo){
        Twilio.init("ACcd5b5a06af1c50fcaa83b8e8446141bb", "5ebcb1be3fc78591c528d23b3ff2362e");
//        PhoneNumber to = new PhoneNumber(phoneNo);
//        PhoneNumber from = new PhoneNumber(twilioConfig.getTrialNumber());
        String otp = getRandomOTP(phoneNo);
        String otpMessage = "Dear Customer , Your OTP is " + otp + ".";
        Message message = Message.creator(new PhoneNumber(phoneNo), new PhoneNumber("+12545664570"),
                otpMessage).create();
        return  otp;
    }

    private String getRandomOTP(String phoneNo) {
        String otp =  new DecimalFormat("000000")
                .format(new Random().nextInt(999999));
        otpCache.put(phoneNo,otp);
        try {
            System.out.println(phoneNo);

            System.out.println(otpCache.get(phoneNo));
        } catch (ExecutionException e) {
            throw new RuntimeException(e);
        }
        return otp;
    }
    //get saved otp
    public String getCacheOtp(String phoneNo){
//        System.out.println(key);
//        System.out.println(otpCache);
        System.out.println(otpCache.asMap());
        try{
//            System.out.println(otpCache.get(key));
            return otpCache.get(phoneNo);
        }catch (Exception e){
            return "";
        }
    }
    //clear stored otp
    public void clearOtp(String key){
        otpCache.invalidate(key);
    }
}
