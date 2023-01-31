import 'package:json_annotation/json_annotation.dart';
import 'package:mobile/models/types.dart';
import 'package:mobile/models/field/Field.dart';
import 'package:mobile/models/field/Variable.dart';

part 'Event.g.dart';

@JsonSerializable()
class Event {
  String id, name, description;
  List<Variable> variables;
  List<Field> fields;

  Event({required this.id, required this.name, required this.description, required this.fields, required this.variables});

  factory Event.fromJson(Json json) => _$EventFromJson(json);

  Json toJson() => _$EventToJson(this);
}