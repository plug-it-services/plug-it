import 'package:flutter/material.dart';
import 'package:mobile/models/plug/Plug.dart';

import 'package:mobile/ui-toolkit/appbar.dart';
import 'package:mobile/PlugApi.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:uuid/uuid.dart';
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
  SharedPreferences? _prefs;
  final List<ThemeMode> modes = [
    ThemeMode.dark,
    ThemeMode.light,
    ThemeMode.system,
  ];

  @override
  void initState() {
    SharedPreferences.getInstance().then((value) {
      setState(() {
        _prefs = value;
        index = _prefs!.getInt('theme') ?? 0;
      });
    });
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Plug It',
      darkTheme: ThemeData.dark(),
      themeMode: modes[index],
      theme: ThemeData(
        primaryTextTheme: Typography().white,
      ),
      home: (_prefs != null)
          ? MyHomePage(
              preferences: _prefs!,
              title: 'Plug It',
              onThemeSelected: (int newIndex) => setState(() {
                    index = newIndex;
                    _prefs?.setInt('theme', index);
                  }),
              themes: modes,
              actualTheme: index)
          : null,
    );
  }
}

class MyHomePage extends StatefulWidget {
  final void Function(int newIndex) onThemeSelected;
  final List<ThemeMode> themes;
  final int actualTheme;
  final SharedPreferences preferences;

  const MyHomePage(
      {super.key,
      required this.preferences,
      required this.title,
      required this.themes,
      required this.onThemeSelected,
      required this.actualTheme});
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
        preferences: widget.preferences,
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
    } else {
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
      PlugApi.sessionToken = const Uuid().v4();
      widget.preferences.setBool('RememberMe', false);
    });
  }

  @override
  void initState() {
    var _rememberMe = widget.preferences.getBool("RememberMe") ?? false;
    var password = widget.preferences.getString("password") ?? "";
    var username = widget.preferences.getString("email") ?? "";
    if (_rememberMe && password != "" && username != "") {
      PlugApi.login(username, password).then((value) {
        setState(() {
          connected = true;
        });
      }).catchError((error) {
        setState(() {
          if (error.response.data is String) {
          } else {}
        });
      });
    }
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return (connected)
        ? NavBar(
            onLogOut: onLogOut,
            onThemeSelected: widget.onThemeSelected,
            themes: widget.themes,
            actualTheme: widget.actualTheme,
          )
        : getCurrentForm();
  }
}
