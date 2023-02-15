
import 'package:flutter/material.dart';
import 'package:mobile/PlugApi.dart';
import 'package:mobile/models/Event.dart';


import 'package:mobile/models/service/Service.dart';
import 'package:mobile/models/plug/Plug.dart';
import 'package:mobile/models/plug/PlugDetails.dart';
import 'package:mobile/models/plug/PlugEvent.dart';
import 'package:mobile/ui-toolkit/PlugItStyle.dart';

import 'package:mobile/ui-toolkit/cards/ActionEditCard.dart';
import 'package:mobile/ui-toolkit/input/InputField.dart';
import '../../ui-toolkit/buttons/ScreenWidthButton.dart';
import '../../ui-toolkit/cards/PlugCard.dart';




class Plugs extends StatefulWidget {
  final Plug? selectedPlug;

  const Plugs({super.key, this.selectedPlug});
  @override
  State<Plugs> createState() => _PlugsState();
}

class _PlugsState extends State<Plugs> {

  PlugDetails? plugEdited;
  bool editing = false;
  bool creating = false;
  bool cardOpen = true;
  int cardIdxOpen = -1;
  List<Plug>? plugs;
  List<Service>? services;
  List<Event?> selectedPlugEvents = [];

  void setEventList()
  {
    setState(() {
      selectedPlugEvents = List.filled(1 + plugEdited!.actions.length, null);
    });

    if (plugEdited!.event != null && (plugEdited!.event!.id != "" && plugEdited!.event!.serviceName != "")) {
      setEventFromPlugEvent(plugEdited!.event!, true, 0);
    }
    int idx = 1;
    for (PlugEvent action in plugEdited!.actions) {
      if ((action.id != "" && action.serviceName != "")) {
        setEventFromPlugEvent(action, false, idx);
      }
      idx++;
    }
  }
  void setEventFromPlugEvent(PlugEvent ev, bool isTrigger, int idx) {
    PlugApi.getEvent(ev.serviceName, ev.id, isTrigger: isTrigger).then((value) {
      setState(() {
        selectedPlugEvents[idx] = value;
      });
    });
  }

  void _createOrEditPlug(Plug? plug) {
    if (plug != null) {
      PlugApi.getPlug(plug.id).then((res) =>
      {
        setState(() {
          creating = false;
          editing = true;
          plugEdited = res;
          setEventList();
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
        setEventList();
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
      PlugApi.createPlug(plugEdited!).then((value) {
          _cancel();
      });
    } else if (editing) {
      PlugApi.editPlug(plugEdited!).then((value) {
          _cancel();
      });
    }
  }
  void _cancel() {
    setState(() {
      plugEdited = null;
      editing = false;
      creating = false;
    });
    PlugApi.getPlugs().then((value) => setState(() => {
      plugs = value
    }));
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
    widgets.add(ActionEditCard(
        services: services ?? [],
        isOpen: (cardIdxOpen == -1 && cardOpen),
        onCardDeploy: () {
          if (cardIdxOpen == -1) {
            setState(() {
              cardOpen = !cardOpen;
            });
          } else {
            setState(() {
              cardIdxOpen = -1;
              cardOpen = true;
            });
          }
        },
        plug: plugEdited!,
        actionIdx: -1,
        selectedPlugEvents: selectedPlugEvents,
        onEventSelected: () => {
          setEventList()
        }
    ));

    widgets.add(const SizedBox(height: 2,));
    widgets.add(IconButton(onPressed: _addAction, icon: Icon(Icons.add_rounded),));
    widgets.add(const SizedBox(height: 2,));
    for (var action in plugEdited!.actions) {
      widgets.add(ActionEditCard(
          services: services ?? [],
          isOpen: (cardIdxOpen == plugEdited!.actions.indexOf(action) && cardOpen),
          onCardDeploy: () {
            if (cardIdxOpen == plugEdited!.actions.indexOf(action)) {
              print("Changing state of card ${plugEdited!.actions.indexOf(action)} to ${!cardOpen}, actual cardIdx: $cardIdxOpen");
              setState(() {
                cardOpen = !cardOpen;
              });
            } else {
              print("Closing card $cardIdxOpen to open ${plugEdited!.actions.indexOf(action)}");
              setState(() {
                cardIdxOpen = plugEdited!.actions.indexOf(action);
                cardOpen = true;
              });
            }
          },
          plug: plugEdited!,
          actionIdx: plugEdited!.actions.indexOf(action),
          selectedPlugEvents: selectedPlugEvents,
          onEventSelected: () => {
            setEventList()
          }
      ));
      widgets.add(const SizedBox(height: 2,));
      widgets.add(IconButton(onPressed: _addAction, icon: Icon(Icons.add_rounded),));
      widgets.add(const SizedBox(height: 2,));
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
    PlugApi.getPlugs().then((value) => setState(() => {
      plugs = value
    }));
    PlugApi.getServices().then((value) => setState((){
      services = value;
      if (widget.selectedPlug != null) {
          _createOrEditPlug(widget.selectedPlug);
      }
    }));
    super.initState();
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