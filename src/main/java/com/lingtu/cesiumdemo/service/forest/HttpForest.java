package com.lingtu.cesiumdemo.service.forest;

import com.dtflys.forest.annotation.DataVariable;
import com.dtflys.forest.annotation.Get;
import org.springframework.stereotype.Component;

/**
 * @InterfaceName HttpForest.java
 * @Description TODO
 * @Author 朱福盛
 * @Date 2021/1/12 17:04
 * @Version 1.0
 */
@Component
public interface HttpForest {

    @Get(
            url = "https://assets.cesium.com/8564/${myURL}",
            headers = "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI4ZDA1M2UwNS04MjliLTQxNzItOTBmZC0zNzVmYzgxMGZhODciLCJpZCI6MjU5LCJhc3NldHMiOnsiODU2NCI6eyJ0eXBlIjoiM0RUSUxFUyJ9fSwic3JjIjoiNGE5NTUzNWYtOTk0ZC00MTY2LWIyMmQtMzE5OGJhM2I1M2IzIiwiaWF0IjoxNjEwNTAwNzY2LCJleHAiOjE2MTA1MDQzNjZ9.99t_xabEEKnlcfecA5Mktu6iB-CaZ5QTvWNFmorVbbQ"
    )
    byte[] getTile(@DataVariable("myURL") String myURL);
}
