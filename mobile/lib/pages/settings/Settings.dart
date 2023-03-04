import 'package:dropdown_search/dropdown_search.dart';
import 'package:flutter/material.dart';
import 'package:mobile/PlugApi.dart';
import 'package:mobile/ui-toolkit/PlugItStyle.dart';
import 'package:mobile/ui-toolkit/buttons/ScreenWidthButton.dart';

class Settings extends StatefulWidget {
  final void Function() onLogOut;
  final void Function(int index) onThemeSelected;
  final List<ThemeMode> themes;
  final int actualTheme;

  const Settings(
      {super.key,
      required this.onLogOut,
      required this.onThemeSelected,
      required this.themes,
      required this.actualTheme});
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
        const SizedBox(
          height: 10,
        ),
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 10),
          child: Row(children: const [
            Text("Change Theme", style: PlugItStyle.subtitleStyle),
          ]),
        ),
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 15),
          child: DropdownSearch<ThemeMode>(
              onChanged: onThemeSelected,
              items: widget.themes,
              selectedItem: widget.themes[widget.actualTheme],
              itemAsString: (service) {
                return service.name.capitalize();
              },
              dropdownDecoratorProps: const DropDownDecoratorProps(
                  dropdownSearchDecoration: InputDecoration(
                hintText: "Select a Theme",
              ))),
        ),
        const SizedBox(
          height: 20,
        ),
        ScreenWidthButton(
          label: 'Disconnect',
          color: Colors.red,
          pressedColor: PlugItStyle.backgroundColor,
          callback: () {
            widget.onLogOut();
          },
        )
      ],
    ));
  }

  void onThemeSelected(ThemeMode? value) {
    widget.onThemeSelected(widget.themes.indexOf(value!));
  }
}
