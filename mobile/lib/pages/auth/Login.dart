import 'dart:math';

import 'package:flutter/material.dart';
import 'package:mobile/models/User.dart';
import 'package:mobile/ui-toolkit/PlugItStyle.dart';
import 'package:mobile/ui-toolkit/buttons/GoogleAuthButton.dart';
import 'package:mobile/ui-toolkit/buttons/ScreenWidthButton.dart';
import 'package:mobile/ui-toolkit/input/InputField.dart';

import 'package:mobile/ui-toolkit/appbar.dart';


class Login extends StatefulWidget {
  final void Function(User) onLogged;
  const Login({super.key, required this.onLogged});


  @override
  State<Login> createState() => _LoginState();
}

class _LoginState extends State<Login> {

  final welcomeTexts = const [
    "Ready to get some plugs ?",
    "Plan it, plug it !",
    "Want some coffee at 8:12 PM ? Just Plug It !",
    "Lights on when you get home ? Nah ...",
    "Try it, but don't get addicted !"
  ];

  String username = "";
  String password = "";
  String? actualText = "";

  void onSign() {
    widget.onLogged(User(id:"1", email:"jean.michel@plug-it.com", username: "Jean Michel Plug It", token:"123456789ABCDEFG"));
  }

  void onGoogleAuth() {
    widget.onLogged(User(id:"1", email:"jean.michel@plug-it.com", username: "Jean Michel Plug It", token:"123456789ABCDEFG"));
  }


  @override
  Widget build(BuildContext context) {
    return
    Scaffold(
      appBar: MyAppBar(),
      body: SafeArea(
          child: Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.start,
                children: [
                  const SizedBox(height: 80),
                  const Text("Welcome !", style: PlugItStyle.titleStyle,),
                  const SizedBox(height: 8),
                  Text(welcomeTexts[Random().nextInt(welcomeTexts.length)], style: PlugItStyle.subtitleStyle,),

                  const SizedBox(height: 25),

                  // LOGIN INPUT
                  InputField(hint: "Email or Username", onChanged: (value) => {
                    password = value
                  }, iconColor: Colors.black, icon: const Icon(Icons.account_circle)),

                  const SizedBox(height: 25),

                  // PASSWORD INPUT
                  InputField(hint: "Password", obscured: true, onChanged: (value) => {
                    password = value
                  }, iconColor: Colors.black, icon: const Icon(Icons.lock)),

                  const SizedBox(height: 25),

                  //Sign in button
                  ScreenWidthButton(label: "Sign In", size: 20, callback: onSign),
                  const SizedBox(height: 25),
                  GoogleAuthButton(callback: onGoogleAuth),
                ],
          )
        )
      ),
    );
  }
}
