import 'dart:math';

import 'package:flutter/material.dart';
import 'package:mobile/PlugApi.dart';
import 'package:mobile/ui-toolkit/PlugItStyle.dart';
import 'package:mobile/ui-toolkit/buttons/ScreenWidthButton.dart';
import 'package:mobile/ui-toolkit/input/InputField.dart';

import 'package:mobile/ui-toolkit/appbar.dart';
import 'package:shared_preferences/shared_preferences.dart';

class StartUp extends StatefulWidget {
  final SharedPreferences? preferences;
  final void Function() onConfirm;
  const StartUp({super.key,
      required this.preferences,
      required this.onConfirm,});

  @override
  State<StartUp> createState() => _StartUpState();
}

class _StartUpState extends State<StartUp> {
  final welcomeTexts = const [
    "Ready to get some plugs ?",
    "Plan it, plug it !",
    "Want some coffee at 8:12 PM ? Just Plug It !",
    "Lights on when you get home ? Nah ...",
    "Try it, but don't get addicted !"
  ];

  bool dontShowAgain = false;
  String? error;

  void onSign() {
    setState(() {
      error = null;
    });
    save();
    widget.onConfirm();
  }


  void save() {
    widget.preferences?.setBool("dontShowAgain", dontShowAgain);
    widget.preferences?.setString("api-url", PlugApi.apiUrl);
    widget.preferences?.setString("assets-url", PlugApi.assetsUrl);
  }

  void rememberMePressed(bool? value) {
    setState(() {
      dontShowAgain = !dontShowAgain;
    });
  }

  void initRememberMe() {
    setState(() {
      dontShowAgain = widget.preferences?.getBool("dontShowAgain") ?? true;
      PlugApi.apiUrl = widget.preferences?.getString("api-url") ?? PlugApi.apiUrl;
      PlugApi.assetsUrl = widget.preferences?.getString("assets-url") ?? PlugApi.assetsUrl;
    });
  }

  @override
  void initState() {
    initRememberMe();
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
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const SizedBox(height: 80),
          const Padding(
              padding: EdgeInsets.symmetric(horizontal: 30),
              child:Text(
            "Welcome to Plug It!",
            style: PlugItStyle.titleStyle,
          )),
          const SizedBox(height: 8),

          const SizedBox(height: 25),

          InputField(
            key: const ValueKey("startupApiField"),
            hint: "Enter API Url",
            label: "API Url",
            labelStyle: const TextStyle(color: Colors.black, fontWeight: FontWeight.bold, fontSize: 20),
            onChanged: (value) => {PlugApi.apiUrl = value},
            iconColor: Colors.black,
            icon: const Icon(Icons.api),
            value: PlugApi.apiUrl,
          ),

          const SizedBox(height: 25),

          InputField(
            key: const ValueKey("startupAssetsField"),
            hint: "Enter Assets Url",
            label: "Assets Url",
            labelStyle: const TextStyle(color: Colors.black, fontWeight: FontWeight.bold, fontSize: 20),
            onChanged: (value) => {PlugApi.assetsUrl = value},
            iconColor: Colors.black,
            icon: const Icon(Icons.web_asset),
            value: PlugApi.assetsUrl,
          ),

          const SizedBox(height: 25),

          //Sign in button
          ScreenWidthButton(
              key: const ValueKey("startupConfirmButton"),
              label: "Confirm",
              size: 20,
              callback: onSign),
          const SizedBox(height: 15),
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Text("Don't show again:", style: PlugItStyle.smallStyle),
              Checkbox(value: dontShowAgain, onChanged: rememberMePressed)
            ],
          )
        ],
      ))),
    );
  }
}
