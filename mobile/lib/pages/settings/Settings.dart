import 'package:flutter/material.dart';
import 'package:mobile/PlugApi.dart';
import 'package:mobile/ui-toolkit/PlugItStyle.dart';
import 'package:mobile/ui-toolkit/buttons/ScreenWidthButton.dart';


class Settings extends StatefulWidget {
  final void Function() onLogOut;

  const Settings({super.key, required this.onLogOut});
  @override
  State<Settings> createState() => _SettingsState();
}

class _SettingsState extends State<Settings> {

  @override
  void initState() {
    super.initState();

  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        body: ListView(
          children: [
            ScreenWidthButton(
              label: 'Disconnect',
              color: PlugItStyle.secondaryColor,
              pressedColor: PlugItStyle.backgroundColor,
              callback: () {
                widget.onLogOut();
              },
            )
          ],
        )
    );
  }
}