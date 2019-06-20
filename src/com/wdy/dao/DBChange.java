package com.wdy.dao;

import java.sql.*;

public class DBChange {
    public static void delete(){
        try {
            Class.forName("com.mysql.jdbc.Driver");
            String URL = "jdbc:mysql://localhost/uav?useUnicode=true&characterEncoding=utf8&serverTimezone=UTC";
            String USER = "root";
            String PWD = "123456";
            Connection conn = DriverManager.getConnection(URL, USER, PWD);
            Statement stat = conn.createStatement();
            String sql = "truncate table sites";
            stat.executeUpdate(sql);
        } catch(ClassNotFoundException e){
            e.printStackTrace();
        } catch(SQLException e) {
            e.printStackTrace();
        }
    }
    public static void delete2(){
        try {
            Class.forName("com.mysql.jdbc.Driver");
            String URL = "jdbc:mysql://localhost/uav?useUnicode=true&characterEncoding=utf8&serverTimezone=UTC";
            String USER = "root";
            String PWD = "123456";
            Connection conn = DriverManager.getConnection(URL, USER, PWD);
            Statement stat = conn.createStatement();
            String sql = "truncate table bounds";
            stat.executeUpdate(sql);
        } catch(ClassNotFoundException e){
            e.printStackTrace();
        } catch(SQLException e) {
            e.printStackTrace();
        }
    }
    public static void insert(int i, String lng, String lat){
        try {
            Class.forName("com.mysql.jdbc.Driver");
            String URL = "jdbc:mysql://localhost/uav?useUnicode=true&characterEncoding=utf8&serverTimezone=UTC";
            String USER = "root";
            String PWD = "123456";
            Connection conn = DriverManager.getConnection(URL, USER, PWD);
            Statement stat = conn.createStatement();
            String sql = "insert into sites values (" +i+ "," +lng+ "," +lat+ ");";
            stat.executeUpdate(sql);
        } catch(ClassNotFoundException e){
            e.printStackTrace();
        } catch (SQLException e){
            e.printStackTrace();
        }
    }
    public static void insert2(int i, String lng, String lat){
        try {
            Class.forName("com.mysql.jdbc.Driver");
            String URL = "jdbc:mysql://localhost/uav?useUnicode=true&characterEncoding=utf8&serverTimezone=UTC";
            String USER = "root";
            String PWD = "123456";
            Connection conn = DriverManager.getConnection(URL, USER, PWD);
            Statement stat = conn.createStatement();
            String sql = "insert into bounds values (" +i+ "," +lng+ "," +lat+ ");";
            stat.executeUpdate(sql);
        } catch(ClassNotFoundException e){
            e.printStackTrace();
        } catch (SQLException e){
            e.printStackTrace();
        }
    }
    public static String select(){
        String string = "[";
        try {
            Class.forName("com.mysql.jdbc.Driver");
            String URL = "jdbc:mysql://localhost/uav?useUnicode=true&characterEncoding=utf8&serverTimezone=UTC";
            String USER = "root";
            String PWD = "123456";
            Connection conn = DriverManager.getConnection(URL, USER, PWD);
            Statement stat = conn.createStatement();
            String sql = "select * from sites";
            ResultSet rs = stat.executeQuery(sql);
            while (rs.next()){
                string+="{\"lng\":"+rs.getString("lng")+",\"lat\":"+rs.getString("lat")+"},";
            }
            string=string.substring(0,string.length()-1);
            string += "]";
        } catch (ClassNotFoundException e){
            e.printStackTrace();
        } catch (SQLException e){
            e.printStackTrace();
        }
        return string;
    }
    public static String select2(){
        String string = "[";
        try {
            Class.forName("com.mysql.jdbc.Driver");
            String URL = "jdbc:mysql://localhost/uav?useUnicode=true&characterEncoding=utf8&serverTimezone=UTC";
            String USER = "root";
            String PWD = "123456";
            Connection conn = DriverManager.getConnection(URL, USER, PWD);
            Statement stat = conn.createStatement();
            String sql = "select * from bounds";
            ResultSet rs = stat.executeQuery(sql);
            while (rs.next()){
                string+="{\"lng\":"+rs.getString("lng")+",\"lat\":"+rs.getString("lat")+"},";
            }
            string=string.substring(0,string.length()-1);
            string += "]";
        } catch (ClassNotFoundException e){
            e.printStackTrace();
        } catch (SQLException e){
            e.printStackTrace();
        }
        return string;
    }
}
