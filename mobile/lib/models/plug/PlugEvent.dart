import 'package:json_annotation/json_annotation.dart';
import 'package:mobile/models/Event.dart';
import 'package:mobile/models/field/Field.dart';
import 'package:mobile/models/field/FieldInput.dart';
import 'package:mobile/models/types.dart';

part 'PlugEvent.g.dart';

@JsonSerializable()
class PlugEvent {
  String id;
  String serviceName;
  List<FieldInput> fields;

  PlugEvent({required this.id, required this.serviceName, required this.fields});

  PlugEvent.fromEventService({required Event event, required this.serviceName, this.id = "", this.fields = const []}) {
    id = event.id;
    for (Field field in event.fields) {
      fields.add(FieldInput(key: field.key, value: ""));
    }
  }

  factory PlugEvent.fromJson(Json json) => _$PlugEventFromJson(json);

  Json toJson() => _$PlugEventToJson(this);
}