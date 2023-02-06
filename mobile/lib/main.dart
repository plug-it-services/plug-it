import 'package:flutter/material.dart';

import 'package:mobile/ui-toolkit/appbar.dart';
import 'package:mobile/PlugApi.dart';
import 'ui-toolkit/navbar.dart';
import 'pages/auth/Login.dart';
import 'pages/auth/SignUp.dart';

void main() {
  PlugApi.init();
  runApp(const MyApp());
}

class MyApp extends StatefulWidget {
  const MyApp({super.key});

  // This widget is the root of your application.


  @override
  State<StatefulWidget> createState() => StateMyApp();
}

class StateMyApp extends State<MyApp> {
  int index = 0;
  final List<ThemeMode> modes = [
    ThemeMode.dark,
    ThemeMode.light,
    ThemeMode.system,
  ];

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Plug It',
      darkTheme: ThemeData.dark(),
      themeMode: modes[index],
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      home: MyHomePage(
          title: 'Plug It',
          onThemeSelected: (int newIndex) => setState(() => {index = newIndex}),
          themes: modes,
          actualTheme: index
      ),
    );
  }
}

class MyHomePage extends StatefulWidget {
  final void Function(int newIndex) onThemeSelected;
  final List<ThemeMode> themes;
  final int actualTheme;

  const MyHomePage({super.key, required this.title, required this.themes, required this.onThemeSelected, required this.actualTheme});
  final String title;

  @override
  State<MyHomePage> createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  bool loginOpen = true;
  bool registerOpen = true;
  bool connected = false;

  Widget getCurrentForm() {
    if (loginOpen) {
      return Login(
        onLogged: (user) {
          setState(() {
            connected = true;
          });
        },
        onChangeToRegisterPressed: () {
          setState(() {
            loginOpen = false;
            registerOpen = true;
          });
        },
      );
    }
    else {
      return Signup(
        onSignedUp: (user) {
          setState(() {
            loginOpen = true;
            registerOpen = false;
          });
        },
        onChangeToLoginPressed: () {
          setState(() {
            loginOpen = true;
            registerOpen = false;
          });
        },
      );
    }
  }

  void onLogOut() {
    setState(() {
      loginOpen = true;
      registerOpen = false;
      connected = false;
      PlugApi.token = null;
    });
  }

  @override
  Widget build(BuildContext context) {
    return (connected) ? NavBar(onLogOut: onLogOut, onThemeSelected: widget.onThemeSelected, themes: widget.themes, actualTheme: widget.actualTheme,) : getCurrentForm();
  }
}
