import 'package:flutter/material.dart';
import 'package:mobile/pages/services/Services.dart';
import 'package:mobile/ui-toolkit/appbar.dart';
import 'package:mobile/main.dart';

import '../pages/home/Home.dart';

class NavBar extends StatefulWidget
{
  const NavBar({Key? key}) : super(key: key);

  @override
  State<NavBar> createState() => _NavBarState();
}

class _NavBarState extends State<NavBar> {
  int index = 0;
  final pages = [
    Home(),
    Services(),
    Home(),
    Home(),
    Home(),
  ];
  final headTitles = [
    null,
    "Services",
    "Plugs",
    "Navigate",
    "Settings"
  ];
  @override
  Widget build(BuildContext context) {
      return Scaffold(
          appBar: MyAppBar(pageTitle:headTitles[index]),
          body: pages[index],
          bottomNavigationBar: NavigationBarTheme(
            data: NavigationBarThemeData (
              indicatorColor: Colors.blue.shade700,
              labelTextStyle: MaterialStateProperty.all(
                const TextStyle(fontSize:14, fontWeight: FontWeight.w500)
              )
            ),
            child: NavigationBar (
              labelBehavior: NavigationDestinationLabelBehavior.onlyShowSelected,
                height: 60,
                selectedIndex: index,
                onDestinationSelected: (index) => setState(() => this.index = index),
                destinations: const [
                  NavigationDestination(
                      icon: Icon(Icons.home),
                      label: 'Home'
                  ),
                  NavigationDestination(
                      icon: Icon(Icons.api_rounded),
                      label: 'Services'
                  ),
                  NavigationDestination(
                      icon: Icon(Icons.backup),
                      label: 'Plugs'
                  ),
                  NavigationDestination(
                      icon: Icon(Icons.search),
                      label: 'Navigate'
                  ),
                  NavigationDestination(
                      icon: Icon(Icons.settings),
                      label: 'Settings'
                  ),
                ]
            )
          )
      );
  }
}