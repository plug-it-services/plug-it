
import 'package:flutter/material.dart';
import 'package:mobile/PlugApi.dart';


import 'package:mobile/models/service/Service.dart';
import 'package:mobile/models/plug/Plug.dart';
import 'package:mobile/models/plug/PlugDetails.dart';
import 'package:mobile/models/plug/PlugEvent.dart';
import 'package:mobile/ui-toolkit/PlugItStyle.dart';

import 'package:mobile/ui-toolkit/cards/ActionEditCard.dart';
import 'package:mobile/ui-toolkit/cards/TriggerEditCard.dart';
import 'package:mobile/ui-toolkit/input/InputField.dart';
import '../../ui-toolkit/buttons/ScreenWidthButton.dart';
import '../../ui-toolkit/cards/PlugCard.dart';




class Plugs extends StatefulWidget {
  Plugs({super.key});
  @override
  State<Plugs> createState() => _PlugsState();
}

class _PlugsState extends State<Plugs> {

  PlugDetails? plugEdited;
  bool editing = false;
  bool creating = false;
  List<Plug>? plugs;
  List<Service>? services;

  void _createOrEditPlug(Plug? plug) {
    
    if (plug != null) {
      PlugApi.getPlug(plug.id).then((res) =>
      {
        setState(() {
          creating = false;
          editing = true;
          plugEdited = res;
        })
      });
    }
    else {
      setState(() {
        editing = false;
        creating = true;
        plugEdited = PlugDetails(
          id: '',
          name: '',
          event: null,
          enabled: true,
          actions: [],
        );
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

  void _addAction() {
    setState(() {
      plugEdited!.actions.add(PlugEvent(id: '', serviceName: '', fields: [],));
    });
  }
  void _savePlug() {
    //TODO: validate data first
    if (creating) {
      PlugApi.createPlug(plugEdited!).then((value) => _cancel());
    } else if (editing) {
      PlugApi.editPlug(plugEdited!).then((value) => {
        _cancel()
      });
    }
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
      PlugApi.deletePlug(plugEdited!.id).then((value) => {
        _cancel()
      });
    }
  }

  List<Widget> _getPlugEdit() {
    List<Widget> widgets = [];
    widgets.add(const SizedBox(height: 5,));
    widgets.add(InputField(
        hint: "Enter Plug Name",
        value: plugEdited!.name,
        onChanged: (value) => plugEdited!.name = value,
    ));
    widgets.add(const SizedBox(height: 20,));
    widgets.add(ActionEditCard(services: services ?? [], isOpen: false, onCardDeploy: () => {}, plug: plugEdited!, actionIdx: -1));
    widgets.add(const SizedBox(height: 2,));
    widgets.add(IconButton(onPressed: _addAction, icon: Icon(Icons.add_rounded),));
    widgets.add(const SizedBox(height: 2,));
    int idx = 0;
    for (var action in plugEdited!.actions) {
      widgets.add(ActionEditCard(services: services ?? [], isOpen: false, onCardDeploy: () => {}, plug: plugEdited!, actionIdx: idx));
      widgets.add(const SizedBox(height: 2,));
      widgets.add(IconButton(onPressed: _addAction, icon: Icon(Icons.add_rounded),));
      widgets.add(const SizedBox(height: 2,));
      idx++;
    }
    widgets.add(const SizedBox(height: 2,));
    widgets.add(Row(
      children: [
        Expanded(
            child:ScreenWidthButton(
              label: 'Save',
              color: PlugItStyle.validationColor,
              pressedColor: PlugItStyle.secondaryColor,
              callback: _savePlug,
            )
        ),

        Expanded(
          child:ScreenWidthButton(
            label: 'Cancel',
            color: PlugItStyle.primaryColor,
            pressedColor: PlugItStyle.secondaryColor,
            callback: _cancel,
          ),
        ),
        (editing) ? Expanded(
          child:ScreenWidthButton(
            label: 'Delete',
            color: Colors.red,
            pressedColor: PlugItStyle.secondaryColor,
            callback: _delete,
          )
        ) : const SizedBox(width: 0,),
      ],
    ));
    return widgets;
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
              children: (editing || creating) ? _getPlugEdit() : _getPlugCards(),
        )
    );
  }
}