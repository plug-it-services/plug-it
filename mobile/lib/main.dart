import 'package:flutter/material.dart';

import 'package:mobile/PlugApi.dart';
import 'package:mobile/models/plug/Plug.dart';
import 'package:mobile/pages/auth/Start-up.dart';
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
  final bool isUnitTesting;
  const MyApp({super.key, this.isUnitTesting = false});

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
      home: (_prefs != null || widget.isUnitTesting)
          ? MyHomePage(
              preferences: _prefs,
              title: 'Plug It',
              onThemeSelected: (int newIndex) => setState(() {
                    index = newIndex;
                    _prefs?.setInt('theme', index);
                  }),
              themes: modes,
              actualTheme: index,
              isUnitTesting: widget.isUnitTesting,
      )
          : null,
    );
  }
}

class MyHomePage extends StatefulWidget {
  final void Function(int newIndex) onThemeSelected;
  final List<ThemeMode> themes;
  final int actualTheme;
  final bool isUnitTesting;
  final SharedPreferences? preferences;

  const MyHomePage(
      {super.key,
      required this.preferences,
      required this.title,
      required this.themes,
      this.isUnitTesting = false,
      required this.onThemeSelected,
      required this.actualTheme});
  final String title;

  @override
  State<MyHomePage> createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  bool loginOpen = true;
  bool registerOpen = false;
  bool connected = false;
  bool showStartUp = false;

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
        goToApiSettings: () {
          setState(() {
            loginOpen = false;
            registerOpen = false;
            showStartUp = true;
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
        goToApiSettings: () {
          setState(() {
            loginOpen = false;
            registerOpen = false;
            showStartUp = true;
          });
        },
      );
    }
  }

  void onConfirm() {
    setState(() {
      loginOpen = true;
      registerOpen = false;
      connected = false;
      showStartUp = false;
    });
    var _rememberMe = widget.preferences?.getBool("RememberMe") ?? false;
    var password = widget.preferences?.getString("password") ?? "";
    var username = widget.preferences?.getString("email") ?? "";
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
  }

  void onLogOut(String? apiUrl, String? assetsUrl) {

    if (assetsUrl != null && assetsUrl != PlugApi.assetsUrl) {
      widget.preferences?.setString('assets-url', assetsUrl);
      PlugApi.assetsUrl = assetsUrl;
    }
    if (apiUrl != null && apiUrl != PlugApi.apiUrl) {
      widget.preferences?.setString('api-url', apiUrl);
      PlugApi.apiUrl = apiUrl;
      setState(() {
        loginOpen = true;
        registerOpen = false;
        connected = false;
        PlugApi.token = null;
        PlugApi.sessionToken = const Uuid().v4();
        widget.preferences?.setBool('RememberMe', false);
      });
    } else if (apiUrl == null && assetsUrl == null) {
      setState(() {
        loginOpen = true;
        registerOpen = false;
        connected = false;
        PlugApi.token = null;
        PlugApi.sessionToken = const Uuid().v4();
        widget.preferences?.setBool('RememberMe', false);
      });
    }

  }

  @override
  void initState() {
    if (widget.isUnitTesting) {
      return;
    }
    showStartUp = !(widget.preferences?.getBool("dontShowAgain") ?? false);
    if (showStartUp) {
      return;
    }
    var _rememberMe = widget.preferences?.getBool("RememberMe") ?? false;
    var password = widget.preferences?.getString("password") ?? "";
    var username = widget.preferences?.getString("email") ?? "";
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
    return (!showStartUp)
        ? ((connected) ? NavBar(
            onLogOut: onLogOut,
            onThemeSelected: widget.onThemeSelected,
            themes: widget.themes,
            actualTheme: widget.actualTheme,
          ) : getCurrentForm())
        : StartUp(preferences: widget.preferences, onConfirm: onConfirm);
  }
}
