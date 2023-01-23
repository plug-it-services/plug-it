import 'package:flutter/material.dart';
import '../../models/Plug.dart';
import '../../models/Service.dart';
import 'HomeCard.dart';


class Home extends StatefulWidget {
  List<Service>? services;
  List<Plug>? plugs;

  Home({super.key, this.services, this.plugs});
  @override
  State<Home> createState() => _HomeState();
}

class _HomeState extends State<Home> {

  int _countConnectedServices() {
    var services = widget.services;
    if (services == null || services.isEmpty) {
      return 0;
    }
    int count = 0;
    for (var element in services) {
      var connected = element.connected;
      if (connected != null && connected) {
        count += 1;
      }
    }
    return count;
  }

  int _countConnectedPlugs() {
    var services = widget.plugs;
    if (services == null || services.isEmpty) {
      return 0;
    }
    int count = 0;
    for (var element in services) {
      var connected = element.activated;
      if (connected != null && connected) {
        count += 1;
      }
    }
    return count;
  }

  int _countNotConnectedPlugs() {
    var services = widget.plugs;
    if (services == null || services.isEmpty) {
      return 0;
    }
    int count = 0;
    for (var element in services) {
      var connected = element.activated;
      if (connected == null || !connected) {
        count += 1;
      }
    }
    return count;
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