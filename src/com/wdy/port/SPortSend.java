package com.wdy.port;

import gnu.io.CommPortIdentifier;
import gnu.io.PortInUseException;
import gnu.io.SerialPort;
import gnu.io.UnsupportedCommOperationException;

import java.io.IOException;
import java.io.OutputStream;
import java.util.Enumeration;

public class SPortSend {
    public static void send(String string){
        //枚举类型，获取所有的通行端口，包括232（PORT_SERIAL）、485、并口等等
        Enumeration enumeration= CommPortIdentifier.getPortIdentifiers();
        while (enumeration.hasMoreElements()){
            //判断enumeration里面是否有更多的元素
            //获取下一个元素，该元素包含某个通信端口的所有信息
            CommPortIdentifier commPortIdentifier= (CommPortIdentifier) enumeration.nextElement();
            //如果该端口的类型是串口
            if (commPortIdentifier.getPortType()==CommPortIdentifier.PORT_SERIAL){
                //判断该串口的名称
                if (commPortIdentifier.getName().equals("COM3")){
                    try {
                        //打开串口，获得该串口的serialPort对象
                        SerialPort serialPort= (SerialPort) commPortIdentifier.open("",2000);
                        //设置该串口参数，9600,8,1,n
                        serialPort.setSerialPortParams(9600,8,1,0);
                        //获取输出流，利用输出流发送数据
                        OutputStream outputStream=serialPort.getOutputStream();
                        outputStream.write(string.getBytes());
                        //一定要关闭串口，否则会阻塞该串口，直到你关闭程序
                        serialPort.close();
                        outputStream.close();
                    } catch (PortInUseException e) {
                        e.printStackTrace();
                    } catch (UnsupportedCommOperationException e) {
                        e.printStackTrace();
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                }
            }
        }
    }
}
