package com.lingtu.cesiumdemo;

import com.thebeastshop.forest.springboot.annotation.ForestScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@ForestScan(basePackages = "com.lingtu.cesiumdemo.service.forest")
public class CesiumDemoApplication {

    public static void main(String[] args) {
        SpringApplication.run(CesiumDemoApplication.class, args);
    }

}
