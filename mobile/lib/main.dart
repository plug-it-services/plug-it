import 'package:flutter/material.dart';

import 'package:mobile/ui-toolkit/appbar.dart';
import 'ui-toolkit/navbar.dart';
import 'pages/auth/Login.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  final _token = null;
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

  bool connected = false;

  @override
  Widget build(BuildContext context) {
    return (connected) ?
    const NavBar() : Login(onLogged: (user) {
      setState(() {
        connected = true;
      });
    },);
  }
}
