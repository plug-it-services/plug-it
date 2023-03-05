import 'package:flutter/material.dart';
import 'package:mobile/pages/navigate/navigate.dart';
import 'package:mobile/pages/settings/Settings.dart';
import 'package:mobile/ui-toolkit/appbar.dart';

import 'package:mobile/models/plug/Plug.dart';

import 'package:mobile/pages/plugs/Plugs.dart';
import 'package:mobile/pages/home/Home.dart';
import 'package:mobile/pages/services/Services.dart';

class NavBar extends StatefulWidget {
  final void Function(String?, String?) onLogOut;
  final void Function(int index) onThemeSelected;
  final List<ThemeMode> themes;
  final int actualTheme;

  const NavBar(
      {Key? key,
      required this.onLogOut,
      required this.onThemeSelected,
      required this.themes,
      required this.actualTheme})
      : super(key: key);

  @override
  State<NavBar> createState() => _NavBarState();
}

class _NavBarState extends State<NavBar> {
  int index = 0;
  Plug? selectedPlug;

  final headTitles = [null, "Services", "Plugs", "Navigate", "Settings"];
  @override
  Widget build(BuildContext context) {
    final pages = [
      const Home(key: ValueKey("homeMainWidget")),
      const Services(),
      Plugs(selectedPlug: selectedPlug),
      Navigate(
          onPlugSelected: (plug) => {
                setState(() {
                  selectedPlug = plug;
                  index = 2;
                })
              }),
      Settings(
        onLogOut: widget.onLogOut,
        onThemeSelected: widget.onThemeSelected,
        themes: widget.themes,
        actualTheme: widget.actualTheme,
      ),
    ];
    return Scaffold(
        appBar: MyAppBar(pageTitle: headTitles[index]),
        body: pages[index],
        bottomNavigationBar: NavigationBarTheme(
            data: NavigationBarThemeData(
                indicatorColor: Colors.blue.shade700,
                labelTextStyle: MaterialStateProperty.all(const TextStyle(
                    fontSize: 14, fontWeight: FontWeight.w500))),
            child: NavigationBar(
                labelBehavior:
                    NavigationDestinationLabelBehavior.onlyShowSelected,
                height: 60,
                selectedIndex: index,
                onDestinationSelected: (index) =>
                    setState(() => this.index = index),
                destinations: const [
                  NavigationDestination(icon: Icon(Icons.home), label: 'Home'),
                  NavigationDestination(
                      icon: Icon(Icons.api_rounded), label: 'Services'),
                  NavigationDestination(
                      icon: Icon(Icons.backup), label: 'Plugs'),
                  NavigationDestination(
                      icon: Icon(Icons.search), label: 'Navigate'),
                  NavigationDestination(
                      icon: Icon(Icons.settings), label: 'Settings'),
                ])));
  }
}
