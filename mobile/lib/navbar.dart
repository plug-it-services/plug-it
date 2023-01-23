import 'package:flutter/material.dart';

class NavBar extends StatefulWidget
{
  const NavBar({Key? key}) : super(key: key);

  @override
  State<NavBar> createState() => _NavBarState();
}

class _NavBarState extends State<NavBar> {
  int index = 0;
  @override
  Widget build(BuildContext context) {
      return NavigationBarTheme(
        data: NavigationBarThemeData (
          indicatorColor: Colors.blue.shade700,
          labelTextStyle: MaterialStateProperty.all(
            const TextStyle(fontSize:14, fontWeight: FontWeight.w500)
          )
        ),
        child: NavigationBar (
            height: 60,
            selectedIndex: index,
            onDestinationSelected: (index) => setState(() => this.index = index),
            destinations: const [
            NavigationDestination(
                icon: Icon(Icons.home),
                label: 'Home'
            ),
            NavigationDestination(
                icon: Icon(Icons.design_services),
                label: 'Services'
            ),
            NavigationDestination(
                icon: Icon(Icons.add),
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
      );
  }
}