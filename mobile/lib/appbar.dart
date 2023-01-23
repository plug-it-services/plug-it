import 'package:flutter/material.dart';

class MyAppBar extends AppBar
{
  String pageTitle = "Plug It";
  MyAppBar({super.key, String? title}) {
    if (title != null) {
      pageTitle += ' - $title';

    }
  }

  @override
  State<MyAppBar> createState() => _MyAppBarState();
}

class _MyAppBarState extends State<MyAppBar> {

  @override
  Widget build(BuildContext context) {
    return AppBar(
      // Here we take the value from the MyHomePage object that was created by
      // the App.build method, and use it to set our appbar title.
      title: Center(child:Text(widget.pageTitle)),
    );
  }
}