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
import 'package:shared_preferences/shared_preferences.dart';


class Login extends StatefulWidget {
  final void Function(User) onLogged;
  final void Function() onChangeToRegisterPressed;
  const Login({super.key, required this.onLogged, required this.onChangeToRegisterPressed});


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

  SharedPreferences? _prefs;
  bool _rememberMe = false;
  String username = "";
  String password = "";
  String? mailError;
  String? passwordError;
  String? error;
  RegExp emailRegExp = RegExp(
    r'^[a-zA-Z\d.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z\d-]+(?:\.[a-zA-Z\d-]+)*$',
  );

  void checkEmail() {
    if (username.isEmpty) {
      setState(() {
        mailError = "Missing email!";
      });
      return;
    }
    if (!emailRegExp.hasMatch(username)) {
      setState(() {
        mailError = "Must be a valid email!";
      });
      return;
    }
    if (mailError != null) {
      setState(() {
        mailError = null;
      });
    }
  }
  void checkPassword() {
    if (password.isEmpty) {
      setState(() {
        passwordError = "Missing password!";
      });
      return;
    }
    if (passwordError != null) {
      setState(() {
        passwordError = null;
      });
    }
  }

  void onSign() {
      checkEmail();
      checkPassword();
      setState(() {
        error = null;
      });
      save();
      PlugApi.login(username, password).then((value) =>
          widget.onLogged(User(id:"", email:username, username: username, token:PlugApi.token ?? ""))
      ).catchError((error) {
        setState(() {
          this.error = error.response.data['message'];
        });
      });
  }

  void onGoogleAuth() {
    widget.onLogged(User(id:"1", email:"jean.michel@plug-it.com", username: "Jean Michel Plug It", token:"123456789ABCDEFG"));
  }

  List<Widget> getMailError() {
    if (mailError == null) {
      return [];
    }
    return [
      ErrorCard(errorMessage: mailError!, errorLevel: Level.warning, showIcon: true,),
      const SizedBox(height: 5,)
    ];
  }

  List<Widget> getPasswordError() {
    if (passwordError == null) {
      return [];
    }
    return [
      ErrorCard(errorMessage: passwordError!, errorLevel: Level.warning, showIcon: true,),
      const SizedBox(height: 5,)
    ];
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

  void save() {
    if (!_rememberMe) {
      return;
    }
    if (_prefs == null) {
      setState(() {
        error = "Error while loading preferences!";
      });
      return;
    }
    _prefs!.setBool("RememberMe", _rememberMe);
    _prefs!.setString("email", username);
    _prefs!.setString("password", password);
  }

  void rememberMePressed(bool? value) {
    setState(() {
      _rememberMe = value ?? !_rememberMe;
    });
  }

  void initRememberMe(SharedPreferences value) {
    _prefs = value;
    setState(() {
      _rememberMe = _prefs!.getBool("RememberMe") ?? false;
      password = _prefs!.getString("password") ?? "";
      username = _prefs!.getString("email") ?? "";
    });

  }

  @override
  void initState() {
    SharedPreferences.getInstance().then((value) {
      initRememberMe(value);
    });
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      resizeToAvoidBottomInset: true,
      appBar: MyAppBar(),
      body: SingleChildScrollView(
      child: Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.start,
                children: [
                  const SizedBox(height: 80),
                  const Text("Welcome back!", style: PlugItStyle.titleStyle,),
                  const SizedBox(height: 8),
                  ...getSignError(),
                  //Text(welcomeTexts[Random().nextInt(welcomeTexts.length)], style: PlugItStyle.subtitleStyle,),

                  const SizedBox(height: 25),

                  // LOGIN INPUT
                  ...getMailError(),
                  InputField(
                      hint: "Email or Username",
                      onChanged: (value) => {username = value},
                      onExitFocus: () => checkEmail(),
                      iconColor: Colors.black,
                      icon: const Icon(Icons.account_circle),
                      value:username,
                  ),

                  const SizedBox(height: 25),

                  // PASSWORD INPUT
                  ...getPasswordError(),
                  InputField(
                      hint: "Password",
                      obscured: true,
                      onChanged: (value) => password = value,
                      onExitFocus: () => checkPassword(),
                      iconColor: Colors.black,
                      icon: const Icon(Icons.lock),
                      value: password
                  ),

                  const SizedBox(height: 25),

                  //Sign in button
                  ScreenWidthButton(label: "Sign In", size: 20, callback: onSign),
                  const SizedBox(height: 15),
                  ScreenWidthButton(label: "No account? Register!", size: 20, callback: widget.onChangeToRegisterPressed),
                  const SizedBox(height: 15),
                  GoogleAuthButton(callback: onGoogleAuth),
                  Row(
                    children: [
                      const Text("Remember me:", style: PlugItStyle.smallStyle),
                      Checkbox(value: _rememberMe, onChanged: rememberMePressed)
                    ],
                  )
                ],
          )
        )
      ),
    );
  }
}
