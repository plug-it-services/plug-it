import 'dart:math';

import 'package:flutter/material.dart';
import 'package:mobile/PlugApi.dart';
import 'package:mobile/models/User.dart';
import 'package:mobile/ui-toolkit/PlugItStyle.dart';
import 'package:mobile/ui-toolkit/buttons/GoogleAuthButton.dart';
import 'package:mobile/ui-toolkit/buttons/ScreenWidthButton.dart';
import 'package:mobile/ui-toolkit/cards/ErrorLabel.dart';
import 'package:mobile/ui-toolkit/input/InputField.dart';

import 'package:mobile/ui-toolkit/appbar.dart';


class Signup extends StatefulWidget {
  final void Function(User) onSignedUp;
  final void Function() onChangeToLoginPressed;

  const Signup({super.key, required this.onSignedUp, required this.onChangeToLoginPressed});


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
  List<String> errors = [];
  String? error;

  Widget getFieldErrors(String label) {
    List<Widget> widgets = [];


    if (errors.isEmpty) {
      return const SizedBox(height: 0,);
    }
    widgets.add(ErrorCard(errorMessage: label.capitalize(), big: true));
    for (var err in errors) {
      if (err.startsWith(label)) {
        widgets.add(ErrorCard(errorMessage: err.substring(label.length), showIcon: false,));
        widgets.add(const SizedBox(height: 3,));
      }
    }
    if (widgets.length == 1) {
      return const SizedBox(height: 0,);
    }
    return Padding(
        padding: const EdgeInsets.symmetric(horizontal: 25),
        child: Container(
          decoration: BoxDecoration(
                color: Colors.grey[800],
                borderRadius: BorderRadius.circular(5)
            ),
          child: Column(
            children: widgets,
          )
        )
    );
  }

  void clearErrors() {
    setState(() {
      errors = [];
      error = null;
    });
  }

  void onSign() {
    clearErrors();
    PlugApi.register(firstName, lastName, email, password).then((value) =>
        widget.onSignedUp(User(id:"", email:email, username: email, token:PlugApi.token ?? ""))
    ).catchError((error) {
      setState(() {
        if (error.response.data['message'] is String) {
          this.error = error.response.data['message'];
          return;
        }
        for (var error in error.response.data['message']) {
          errors.add(error);
        }
      });
    });
  }

  void onGoogleAuth() {
    widget.onSignedUp(User(id:"1", email:"jean.michel@plug-it.com", username: "Jean Michel Plug It", token:"123456789ABCDEFG"));
  }

  List<Widget> getSignError() {
    if (error == null) {
      return [
        Text(welcomeTexts[Random().nextInt(welcomeTexts.length)], style: PlugItStyle.subtitleStyle,),
      ];
    }
    return [
      ErrorCard(errorMessage: error!, errorLevel: Level.error, showIcon: true, big: true),
    ];
  }

  @override
  Widget build(BuildContext context) {
    return
    Scaffold(
      appBar: MyAppBar(),
      resizeToAvoidBottomInset: true,
      body: SingleChildScrollView(
          child: Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.start,
                children: [
                  const SizedBox(height: 30),
                  const Text("Greetings!", style: PlugItStyle.titleStyle,),
                  const SizedBox(height: 8),
                  ...getSignError(),

                  const SizedBox(height: 25),

                  // LOGIN INPUT
                  getFieldErrors("firstname"),
                  const SizedBox(height: 3),
                  InputField(
                      hint: "Firstname",
                      onChanged: (value) => {firstName = value},
                      iconColor: Colors.black,
                      icon: const Icon(Icons.account_circle),
                      value: firstName,
                  ),

                  const SizedBox(height: 25),

                  // LOGIN INPUT
                  getFieldErrors("lastname"),
                  const SizedBox(height: 3),
                  InputField(hint: "Lastname", onChanged: (value) => {
                    lastName = value
                  }, iconColor: Colors.black, icon: const Icon(Icons.account_circle), value: lastName,),

                  const SizedBox(height: 25),

                  // LOGIN INPUT
                  getFieldErrors("email"),
                  const SizedBox(height: 3),
                  InputField(hint: "Email", onChanged: (value) => {
                    email = value
                  }, iconColor: Colors.black, icon: const Icon(Icons.email), value:email),

                  const SizedBox(height: 25),

                  // PASSWORD INPUT
                  getFieldErrors("password"),
                  const SizedBox(height: 3),
                  InputField(hint: "Password", obscured: true, onChanged: (value) {
                    password = value;
                  }, iconColor: Colors.black, icon: const Icon(Icons.lock), value: password),

                  const SizedBox(height: 25),

                  //Sign in button
                  ScreenWidthButton(
                      key: const ValueKey("registerSignUpButton"),
                      label: "Sign Up", size: 20, callback: onSign),
                  const SizedBox(height: 15),
                  ScreenWidthButton(label: "Have an account? Sign in!", size: 20, callback: widget.onChangeToLoginPressed),
                  const SizedBox(height: 15),
                  GoogleAuthButton(callback: onGoogleAuth),
                ],
          )
        )
      ),
    );
  }
}
