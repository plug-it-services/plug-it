
import 'package:flutter/material.dart';
import 'package:mobile/PlugApi.dart';

import 'package:mobile/models/service/Service.dart';
import 'package:mobile/models/plug/Plug.dart';
import 'package:mobile/pages/plugs/plug_edit_page.dart';

import '../../ui-toolkit/buttons/ScreenWidthButton.dart';
import '../../ui-toolkit/cards/PlugCard.dart';




class Plugs extends StatefulWidget {
  final Plug? selectedPlug;

  const Plugs({super.key, this.selectedPlug});
  @override
  State<Plugs> createState() => _PlugsState();
}

class _PlugsState extends State<Plugs> {

  bool editing = false;
  bool creating = false;
  List<Plug>? plugs;
  List<Service>? services;
  Plug? selectedPlug;


  void _createOrEditPlug(Plug? plug) {
    selectedPlug = plug;
    if (plug != null) {
      setState(() {
        editing = true;
        creating = false;
        selectedPlug = plug;
      });
    }
    else {
      setState(() {
        editing = false;
        creating = true;
        selectedPlug = null;
      });
    }
  }

  List<Widget> _getPlugCards()
  {
    List<Widget> widgets = [];
    widgets.add(const SizedBox(height: 5,));
    widgets.add(ScreenWidthButton(
      label: "Create",
      height: 50,
      callback: () => _createOrEditPlug(null),
    ));
    for (Plug plug in plugs ?? []) {
      widgets.add(const SizedBox(height: 10,));
      widgets.add(PlugCard(
          plug: plug,
          callback: () => _createOrEditPlug(plug),
      ));
    }

    return widgets;
  }

  void _cancel() {
    setState(() {
      selectedPlug = null;
      editing = false;
      creating = false;
    });
    PlugApi.getPlugs().then((value) => setState(() => {
      plugs = value
    }));
  }


  @override
  void initState() {
    PlugApi.getPlugs().then((value) => setState(() => {
      plugs = value
    }));
    PlugApi.getServices().then((value) => setState((){
      services = value;
      if (widget.selectedPlug != null) {
          _createOrEditPlug(widget.selectedPlug);
      } else {
        setState(() {
          selectedPlug = null;
        });
      }
    }));
    super.initState();
  }
  
  @override
  Widget build(BuildContext context) {
    return (editing || creating)
        ? PlugEdit(
            selectedPlug: selectedPlug,
            services: services ?? [],
            editing: editing,
            onEditEnd: () {
              setState(() {
                _cancel();
              });
            },
        )
        : Scaffold(
            body: ListView(
              children: _getPlugCards(),
        )
    );
  }
}