import 'dart:math';

import 'package:flutter/material.dart';
import 'package:mobile/PlugApi.dart';
import 'package:mobile/models/User.dart';
import 'package:mobile/ui-toolkit/PlugItStyle.dart';
import 'package:mobile/ui-toolkit/buttons/GoogleAuthButton.dart';
import 'package:mobile/ui-toolkit/buttons/ScreenWidthButton.dart';
import 'package:mobile/ui-toolkit/input/InputField.dart';

import 'package:mobile/ui-toolkit/appbar.dart';


class Signup extends StatefulWidget {
  final void Function(User) onSignedUp;
  const Signup({super.key, required this.onSignedUp});


  @override
  State<Signup> createState() => _SignupState();
}

class _SignupState extends State<Signup> {

  final welcomeTexts = const [
    "Ready to get some plugs ?",
    "Plan it, plug it !",
    "Want some coffee at 8:12 PM ? Just Plug It !",
    "Lights on when you get home ? Nah ...",
    "Try it, but don't get addicted !"
  ];

  String firstName = "";
  String lastName = "";
  String email = "";
  String password = "";

  void onSign() {
    /*PlugApi.signup(firstName, lastName, email, password).then((value) =>
        widget.onSignedUp(User(id:"", email:email, username: email, token:PlugApi.token ?? ""))
    );*/
  }

  void onGoogleAuth() {
    widget.onSignedUp(User(id:"1", email:"jean.michel@plug-it.com", username: "Jean Michel Plug It", token:"123456789ABCDEFG"));
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
                  InputField(hint: "Firstname", onChanged: (value) => {
                    firstName = value
                  }, iconColor: Colors.black, icon: const Icon(Icons.account_circle)),

                  const SizedBox(height: 25),

                  // LOGIN INPUT
                  InputField(hint: "Lastname", onChanged: (value) => {
                    lastName = value
                  }, iconColor: Colors.black, icon: const Icon(Icons.account_circle)),

                  const SizedBox(height: 25),

                  // LOGIN INPUT
                  InputField(hint: "Email", onChanged: (value) => {
                    email = value
                  }, iconColor: Colors.black, icon: const Icon(Icons.email)),

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
