import 'package:flutter/material.dart';
import 'package:mobile/PlugApi.dart';

import 'package:mobile/models/plug/Plug.dart';
import 'package:mobile/models/service/Service.dart';

import 'HomeCard.dart';


class Home extends StatefulWidget {

  Home({super.key});
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
      body: ListView(
        children: [
          HomeCard(title:"My Services", description: "You have ${_countConnectedServices()} connected services.",),
          HomeCard(title:"My Plugs", description: "You have ${_countConnectedPlugs()} active plugs,\n   and ${_countNotConnectedPlugs()} more available.",),
        ],
      )
    );
  }
}