import 'package:dropdown_search/dropdown_search.dart';
import 'package:flutter/material.dart';
import 'package:mobile/PlugApi.dart';
import 'package:mobile/ui-toolkit/PlugItStyle.dart';
import 'package:mobile/ui-toolkit/buttons/ScreenWidthButton.dart';
import 'package:mobile/ui-toolkit/input/InputField.dart';

class Settings extends StatefulWidget {
  final void Function(String? apiUrl, String? assetsUrl) onLogOut;
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
  String apiUrl = PlugApi.apiUrl;
  String assetsUrl = PlugApi.assetsUrl;

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
          height: 20,
        ),
        const Divider(color: Colors.white,),
        const SizedBox(
          height: 20,
        ),
        const Center(child:Text("Theme Settings", style: PlugItStyle.subtitleStyle)),
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
        const SizedBox(height: 20),
        const Divider(color: Colors.white,),
        const SizedBox(height: 20),
        const Center(child:Text("Api Settings", style: PlugItStyle.subtitleStyle)),

        const SizedBox(height: 30),
        InputField(
          key: const ValueKey("startupApiField"),
          hint: "Enter API Url",
          label: "API Url",
          labelStyle: const TextStyle(color: Colors.black, fontWeight: FontWeight.bold, fontSize: 20),
          onChanged: (value) => {apiUrl = value},
          iconColor: Colors.black,
          icon: const Icon(Icons.api),
          value: apiUrl,
        ),

        const SizedBox(height: 25),

        InputField(
          key: const ValueKey("startupAssetsField"),
          hint: "Enter Assets Url",
          label: "Assets Url",
          labelStyle: const TextStyle(color: Colors.black, fontWeight: FontWeight.bold, fontSize: 20),
          onChanged: (value) => {assetsUrl = value},
          iconColor: Colors.black,
          icon: const Icon(Icons.web_asset),
          value: assetsUrl,
        ),
        const SizedBox(height: 25),

        ScreenWidthButton(
          label: 'Apply Changes and Disconnect',
          color: PlugItStyle.primaryColor,
          pressedColor: PlugItStyle.backgroundColor,
          callback: () {
            widget.onLogOut(apiUrl, assetsUrl);
          },
        ),
        const SizedBox(height: 20),
        const Divider(color: Colors.white,),
        const SizedBox(height: 20),
        ScreenWidthButton(
          label: 'Disconnect',
          color: Colors.red,
          pressedColor: PlugItStyle.backgroundColor,
          callback: () {
            widget.onLogOut(null, null);
          },
        )
      ],
    ));
  }

  void onThemeSelected(ThemeMode? value) {
    widget.onThemeSelected(widget.themes.indexOf(value!));
  }
}
