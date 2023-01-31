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

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Plug It',
      darkTheme: ThemeData.dark(),
      themeMode: ThemeMode.dark,
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      home: const MyHomePage(title: 'Plug It', ),
    );
  }
}

class MyHomePage extends StatefulWidget {
  const MyHomePage({super.key, required this.title});
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

  @override
  Widget build(BuildContext context) {
    return (connected) ?
    const NavBar() : getCurrentForm();
  }
}
