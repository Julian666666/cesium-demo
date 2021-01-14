package com.lingtu.cesiumdemo.controller;

import com.lingtu.cesiumdemo.service.forest.HttpForest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import sun.misc.IOUtils;

import java.io.*;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * @ClassName TestController.java
 * @Description TODO
 * @Author 朱福盛
 * @Date 2021/1/12 14:03
 * @Version 1.0
 */
@Slf4j
@RestController
@RequestMapping("/test")
public class TestController {
    @Value("classpath:static/tile/tileset.json")
    private Resource addTaskJson;
    @Autowired
    private HttpForest httpForest;

    @RequestMapping("/readTest")
    public String test() {
        List<String> fieldValues = new ArrayList<>();
        try {
            String jsonStr = new String(IOUtils.readFully(addTaskJson.getInputStream(), -1,true));
            String fieldName = "uri";
            String regex = "(?<=(\"" + fieldName + "\": \")).*?(?=(\"))";
            Pattern pattern = Pattern.compile(regex);
            Matcher matcher = pattern.matcher(jsonStr);
            while (matcher.find()) {
//                if (StringUtils.isNotEmpty(matcher.group().trim())) {
                    fieldValues.add(matcher.group().trim());
//                }
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
        List<String> list = fieldValues.subList(706, fieldValues.size());
        for (String uri : list) {
            byte[] tile = httpForest.getTile(uri);

            BufferedInputStream bis = null;
            FileOutputStream fos = null;
            BufferedOutputStream output = null;
            String filePath = "C:\\Users\\zhufusheng\\Desktop\\b3dm\\" + uri;
            ByteArrayInputStream byteInputStream = new ByteArrayInputStream(tile);
            bis = new BufferedInputStream(byteInputStream);
            File file = new File(filePath);
            // 获取文件的父路径字符串
            File path = file.getParentFile();
            if (!path.exists()) {
                log.info("文件夹不存在，创建。path={}", path);
                boolean isCreated = path.mkdirs();
                if (!isCreated) {
                    log.error("创建文件夹失败，path={}", path);
                }
            }
            try {
                fos = new FileOutputStream(file);

                // 实例化OutputString 对象
                output = new BufferedOutputStream(fos);
                byte[] buffer = new byte[1024];
                int length = bis.read(buffer);
                while (length != -1) {
                    output.write(buffer, 0, length);
                    length = bis.read(buffer);
                }
                output.flush();
            } catch (Exception e) {
                e.printStackTrace();
            } finally {
                try {
                    bis.close();
                    fos.close();
                    output.close();
                } catch (IOException e0) {
                    log.error("文件处理失败，filePath={}", filePath, e0);
                }
            }
        }


        return "ok";
    }
}
