package com.example.vvdung.tin4403_n2;


import android.os.AsyncTask;
import android.support.v7.app.AlertDialog;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;

import android.util.Base64;

import java.lang.String;

import java.io.IOException;


import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;
import okhttp3.FormBody;

public class MainActivity extends AppCompatActivity {
    EditText m_edtUser, m_edtPass;
    Button m_btnLogin;
    AlertDialog.Builder m_MsgDlg;

    //OkHttpClient client = new OkHttpClient();
    String url= "http://192.168.49.1:3000/";
    String url_register= "http://192.168.49.1:3000/register";
    MediaType JSON = MediaType.get("application/json; charset=utf-8");


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        m_edtUser = findViewById(R.id.editUser);
        m_edtPass = findViewById(R.id.editPass);
        m_btnLogin = findViewById(R.id.btnLogin);

        m_MsgDlg = new AlertDialog.Builder(this);

        m_btnLogin.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                DoLogin();

            }
        });
    }
    //throws Exception
    public void DoLogin()  {
        String szUser = m_edtUser.getText().toString();
        String szPass = m_edtPass.getText().toString();
        Log.d(" USERNAME:",szUser);
        Log.d(" PASSWORD:",szPass);

        try {
            apiCreateAccount(szUser,szPass,"abc@gmail.com");
        } catch (IOException e) {
            Log.d(" RESPONSE FAILED",e.toString());
            e.printStackTrace();
        }

        /*
        String str = String.format("{'uname':'%s','pass':'%s'}",szUser,szPass);
        Log.d(" STRING: ",str);
        String _enCode = Base64_Encode(str);
        Log.d(" BASE64 ENCODE: ",_enCode);

        String _deCode = Base64_Decode(_enCode);
        Log.d(" BASE64 DECODE: ",_deCode);

        m_MsgDlg.setTitle("Thông báo");
        m_MsgDlg.setMessage(_enCode);
        m_MsgDlg.show();
        return;*/

        /*
        try {
            TestWebServiceAPI();

        } catch (IOException e) {
            Log.d(" RESPONSE FAILED",e.toString());
            e.printStackTrace();
        }*/


    }

    void TestWebServiceAPI() throws IOException {

        OkHttpClient client = new OkHttpClient();

        Request request = new Request.Builder()
                .url(url)
                .build();

        client.newCall(request).enqueue(new Callback() {
            @Override
            public void onFailure(Call call, IOException e) {
                call.cancel();
            }

            @Override
            public void onResponse(Call call, Response response) throws IOException {

                final String myResponse = response.body().string();

                MainActivity.this.runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        Log.d(" RESPONSE:",myResponse);
                        m_MsgDlg.setTitle("WEBSERVICE API");
                        m_MsgDlg.setMessage("SERVER RESPONSE :\n" + myResponse );
                        m_MsgDlg.show();
                    }
                });

            }
        });
    }


    void apiCreateAccount(String _username, String _pass, String _email) throws IOException
    {
        OkHttpClient client = new OkHttpClient();

        // Create okhttp3 form body builder.
        FormBody.Builder formBodyBuilder = new FormBody.Builder();

        // Add form parameter
        formBodyBuilder.add("uname", _username);
        formBodyBuilder.add("pass", _pass);
        formBodyBuilder.add("email", "abc@gmail.com");

        // Build form body.
        FormBody formBody = formBodyBuilder.build();
        // Create a http request object.
        Request request = new Request.Builder()
                .url(url_register)
                .post(formBody)
                .build();

        client.newCall(request).enqueue(new Callback() {
            @Override
            public void onFailure(Call call, IOException e) {
                call.cancel();
            }

            @Override
            public void onResponse(Call call, Response response) throws IOException {

                final String myResponse = response.body().string();
                int respCode = response.code();
                Log.d(" 1. RESPONSE CODE: ", Integer.toString(respCode));
                MainActivity.this.runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        Log.d(" RESPONSE:",myResponse);
                        m_MsgDlg.setTitle("WEBSERVICE API");
                        m_MsgDlg.setMessage("SERVER RESPONSE :\n" + myResponse );
                        m_MsgDlg.show();
                    }
                });

            }
        });

    }

    String Base64_Encode(String str){
        byte[] strBytes = str.getBytes();
        byte[] encoded = Base64.encode(
                strBytes, Base64.URL_SAFE | Base64.NO_PADDING | Base64.NO_WRAP);
        return new String(encoded);
    }

    String Base64_Decode(String enStr){
        byte[] decoded = Base64.decode(enStr.getBytes(), Base64.DEFAULT);
        return new String(decoded);
    }
}
