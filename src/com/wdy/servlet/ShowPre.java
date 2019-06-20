package com.wdy.servlet;

import com.wdy.dao.DBChange;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

public class ShowPre extends HttpServlet {
    @Override
    protected void service(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String string = DBChange.select();
        resp.setContentType("text/json; charset=UTF-8; Cache-Control: no-cache");
        resp.getWriter().write(string);
    }
}
