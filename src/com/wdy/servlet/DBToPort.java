package com.wdy.servlet;

import com.wdy.dao.DBChange;
import com.wdy.port.SPortSend;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

public class DBToPort extends HttpServlet {
    @Override
    protected void service(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String string = DBChange.select();
        SPortSend.send(string);

        resp.setContentType("text/plain; charset=UTF-8");
        resp.getWriter().write("上传无人机成功！");
    }
}
