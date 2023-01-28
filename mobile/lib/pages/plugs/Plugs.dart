import 'dart:js_util';

import 'package:flutter/material.dart';
import 'package:mobile/models/Action.dart';
import 'package:mobile/models/Service.dart';
import 'package:mobile/ui-toolkit/cards/ActionEditCard.dart';
import 'package:mobile/ui-toolkit/cards/TriggerEditCard.dart';
import 'package:mobile/ui-toolkit/input/InputField.dart';
import '../../models/Plug.dart';
import '../../ui-toolkit/buttons/ScreenWidthButton.dart';
import '../../ui-toolkit/cards/PlugCard.dart';


class Plugs extends StatefulWidget {
  List<Plug>? plugs;
  List<Service>? services;

  Plugs({super.key, this.plugs, this.services});
  @override
  State<Plugs> createState() => _PlugsState();
}

class _PlugsState extends State<Plugs> {

  Plug? plugEdited;
  bool editing = false;
  bool creating = false;


  void _createOrEditPlug(Plug? plug)
  {
    if (plug != null) {
      creating = false;
      editing = true;
      plugEdited = plug;
    }
    else {
      editing = false;
      creating = true;
      plugEdited = Plug();
    }
  }

  List<Widget> _getPlugCards()
  {
    List<Widget> widgets = [];
    for (Plug plug in widget.plugs!) {
      widgets.add(PlugCard(
          plug: plug,
          callback: () => _createOrEditPlug(plug),
      ));
    }
    widgets.add(ScreenWidthButton(
      label: "Create",
      height: 50,
      callback: () => _createOrEditPlug(null),
    ));
    return widgets;
  }

  void _addAction() {
    setState(() {
      if (plugEdited!.actions == null) {
        plugEdited!.actions = [Event()];
      }
      else {
        plugEdited!.actions?.add(Event());
      }
    });
  }
  void _savePlug() {
    if (creating) {
      //TODO: send post request of the current plug
    } else if (editing) {
      //TODO: send put request of the current plug
    }
    _cancel();
  }
  void _cancel() {
    setState(() {
      plugEdited = null;
      editing = false;
      creating = false;
    });
  }

  void _delete() {
    if (editing) {
      //TODO: send delete request of the current plug
    }
    _cancel();
  }

  List<Widget> _getPlugEdit() {
    List<Widget> widgets = [];
    widgets.add(InputField(
        hint: "Enter Plug Name",
        value: plugEdited!.name,
    ));
    widgets.add(const SizedBox(height: 20,));
    widgets.add(TriggerEditCard(services: widget.services!, isOpen: true, onCardDeploy: () => {}, plug: plugEdited!));
    widgets.add(const SizedBox(height: 15,));
    widgets.add(IconButton(onPressed: _addAction, icon: Icon(Icons.add_rounded),));
    widgets.add(const SizedBox(height: 15,));
    int idx = 0;
    for (var action in plugEdited!.actions!) {
      widgets.add(ActionEditCard(services: widget.services!, isOpen: false, onCardDeploy: () => {}, plug: plugEdited!, actionIdx: idx));
      widgets.add(const SizedBox(height: 15,));
      widgets.add(IconButton(onPressed: _addAction, icon: Icon(Icons.add_rounded),));
      widgets.add(const SizedBox(height: 15,));
      idx++;
    }
    widgets.add(const SizedBox(height: 5,));
    widgets.add(Row(
      children: [
        ScreenWidthButton(
          label: 'Save',
          callback: _savePlug,
        ),
        ScreenWidthButton(
          label: 'Cancel',
          callback: _cancel,
        ),
        ScreenWidthButton(
          label: 'Delete',
          callback: _delete,
        )
      ],
    ));
    return widgets;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        body: ListView(
          children: (editing || creating) ? _getPlugEdit() : _getPlugCards(),
        )
    );
  }
}