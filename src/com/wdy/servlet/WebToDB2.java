package com.wdy.servlet;

import com.wdy.dao.DBChange;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;

public class WebToDB2 extends HttpServlet {
    @Override
    protected void service(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String string = getStreamString(req.getInputStream());
        JSONArray jsonArray = JSONArray.fromObject(string);
        JSONObject jsonObject;
        DBChange.delete2();
        for(int i=0; i<jsonArray.size(); i++){
            jsonObject = jsonArray.getJSONObject(i);
            DBChange.insert2(i, jsonObject.getString("lng"), jsonObject.getString("lat"));
        }

        /*for(int i=0; i<jsonArray.size(); i++){
            jsonObject = jsonArray.getJSONObject(i);
            resp.getWriter().write(jsonObject.getString("lng"));
            resp.getWriter().write(";");
            resp.getWriter().write(jsonObject.getString("lat"));
            resp.getWriter().write("\r");
        }*/
        resp.setContentType("text/plain; charset=UTF-8");
        resp.getWriter().write("边界写入数据库成功！");
    }

    /*--------------------------------java中输入流转成字符串---------------------------------------------*/
    public static String getStreamString(InputStream tInputStream){
        if (tInputStream != null){
            try{
                BufferedReader tBufferedReader = new BufferedReader(new InputStreamReader(tInputStream));
                StringBuffer tStringBuffer = new StringBuffer();
                String sTempOneLine;//= new String("");
                while ((sTempOneLine = tBufferedReader.readLine()) != null){
                    tStringBuffer.append(sTempOneLine);
                }
                return tStringBuffer.toString();
            }catch (Exception ex){
                ex.printStackTrace();
            }
        }
        return null;
    }
}
