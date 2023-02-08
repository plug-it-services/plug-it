import 'package:flutter/material.dart';
import 'package:mobile/PlugApi.dart';

import 'package:mobile/models/plug/Plug.dart';
import 'package:mobile/models/service/Service.dart';
import 'package:mobile/ui-toolkit/PlugItStyle.dart';

import 'HomeCard.dart';


class Home extends StatefulWidget {

  const Home({super.key});
  @override
  State<Home> createState() => _HomeState();
}

class _HomeState extends State<Home> {
  List<Plug>? plugs;
  List<Service>? services;


  int _countConnectedServices() {
    if (services == null || services!.isEmpty) {
      return 0;
    }
    int count = 0;
    for (var element in services!) {
      var connected = element.connected;
      if (connected) {
        count += 1;
      }
    }
    return count;
  }

  int _countConnectedPlugs() {
    var services = plugs;
    if (services == null || services.isEmpty) {
      return 0;
    }
    int count = 0;
    for (var element in services) {
      var connected = element.enabled;
      if (connected) {
        count += 1;
      }
    }
    return count;
  }

  int _countNotConnectedPlugs() {
    var services = plugs;
    if (services == null || services.isEmpty) {
      return 0;
    }
    int count = 0;
    for (var element in services) {
      if (!element.enabled) {
        count += 1;
      }
    }
    return count;
  }

  @override
  void initState() {
    super.initState();
    PlugApi.getPlugs().then((value) => setState(() => {
      plugs = value
    }));
    PlugApi.getServices().then((value) => setState(() => {
      services = value
    }));
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        resizeToAvoidBottomInset: true,
        body: ListView(
          children: [
            HomeCard(
              title: const Text("Connected Services", style: PlugItStyle.biggerSubtitleStyle),
              description: [
                const Text("You have ", style: PlugItStyle.subtitleStyle,),
                Text("${_countConnectedServices()} ", style: PlugItStyle.subtitleStyleCorrectLight),
                const Text("connected services.", style: PlugItStyle.subtitleStyle,),
              ]
            ),
            HomeCard(
              title: const Text("Enabled Plugs", style: PlugItStyle.biggerSubtitleStyle),
              description: [
                const Text("You have ", style: PlugItStyle.subtitleStyle,),
                Text("${_countConnectedPlugs()} ", style: PlugItStyle.subtitleStyleCorrectLight),
                const Text("connected Plugs.", style: PlugItStyle.subtitleStyle,),
              ]
            ),
            HomeCard(
              title: const Text("Not Connected Services", style: PlugItStyle.biggerSubtitleStyle),
              description: [
                const Text("You have ", style: PlugItStyle.subtitleStyle,),
                Text("${(services?.length ?? 0) - _countConnectedServices()} ", style: PlugItStyle.subtitleStyleError),
                const Text("not connected services.", style: PlugItStyle.subtitleStyle,),
              ]
            ),
            HomeCard(
              title: const Text("Disabled Plugs", style: PlugItStyle.biggerSubtitleStyle),
              description: [
                const Text("You have ", style: PlugItStyle.subtitleStyle,),
                Text("${_countNotConnectedPlugs()} ", style: PlugItStyle.subtitleStyleError),
                const Text("unused Plugs.", style: PlugItStyle.subtitleStyle,),
              ]
            ),
            HomeCard(
              title: const Text("Total Services", style: PlugItStyle.biggerSubtitleStyle),
              description: [
                const Text("We provide ", style: PlugItStyle.subtitleStyle,),
                Text("${(services?.length ?? 0) - _countConnectedPlugs()} ", style: PlugItStyle.subtitleStyleCorrectLight),
                const Text("services in total.", style: PlugItStyle.subtitleStyle,),
              ]
            ),
            HomeCard(
              title: const Text("Total Plugs", style: PlugItStyle.biggerSubtitleStyle),
              description: [
                const Text("You have ", style: PlugItStyle.subtitleStyle,),
                Text("${plugs?.length ?? 0} ", style: PlugItStyle.subtitleStyleCorrectLight),
                const Text("Plugs in total.", style: PlugItStyle.subtitleStyle,),
              ]
            ),
          ],
        )
    );
  }
}